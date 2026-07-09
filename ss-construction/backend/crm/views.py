from datetime import date, timedelta

from django.db.models import CharField, Count, Q
from django.db.models.functions import Cast, TruncMonth
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from .filters import CustomerFilter
from .models import Customer, CustomerDocument, CustomerImage, FollowUp
from .permissions import IsSiteAdmin
from .serializers import (
    CRMReportSerializer,
    CustomerDetailSerializer,
    CustomerListSerializer,
    CustomerWriteSerializer,
    FollowUpSerializer,
)


class CustomerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSiteAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = CustomerFilter
    ordering_fields = ['created_at', 'updated_at', 'full_name', 'estimated_budget']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = (
            Customer.objects.select_related('assigned_engineer', 'created_by')
            .prefetch_related('project_images', 'documents', 'follow_ups')
            .all()
        )

        search = self.request.query_params.get('search', '').strip()
        if search:
            queryset = queryset.annotate(budget_text=Cast('estimated_budget', output_field=CharField())).filter(
                Q(full_name__icontains=search)
                | Q(phone_number__icontains=search)
                | Q(alternate_phone__icontains=search)
                | Q(email__icontains=search)
                | Q(address__icontains=search)
                | Q(city__icontains=search)
                | Q(district__icontains=search)
                | Q(project_type__icontains=search)
                | Q(construction_status__icontains=search)
                | Q(notes__icontains=search)
                | Q(budget_text__icontains=search)
            )

        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return CustomerListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return CustomerWriteSerializer
        return CustomerDetailSerializer

    def _save_uploads(self, customer):
        request = self.request

        for image_file in request.FILES.getlist('project_images'):
            CustomerImage.objects.create(customer=customer, image=image_file)

        blueprint_file = request.FILES.get('blueprint_pdf')
        if blueprint_file:
            customer.documents.filter(document_type='blueprint').delete()
            CustomerDocument.objects.create(
                customer=customer,
                document_type='blueprint',
                title='Blueprint PDF',
                file=blueprint_file,
            )

        agreement_file = request.FILES.get('agreement_pdf')
        if agreement_file:
            customer.documents.filter(document_type='agreement').delete()
            CustomerDocument.objects.create(
                customer=customer,
                document_type='agreement',
                title='Agreement PDF',
                file=agreement_file,
            )

        for other_file in request.FILES.getlist('other_documents'):
            CustomerDocument.objects.create(
                customer=customer,
                document_type='other',
                title=other_file.name,
                file=other_file,
            )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        customer = serializer.save(created_by=request.user)
        self._save_uploads(customer)
        detail = CustomerDetailSerializer(customer, context=self.get_serializer_context())
        return Response(detail.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        customer = serializer.save()
        self._save_uploads(customer)
        detail = CustomerDetailSerializer(customer, context=self.get_serializer_context())
        return Response(detail.data)

    @action(detail=True, methods=['post'], url_path='follow-ups')
    def add_follow_up(self, request, pk=None):
        customer = self.get_object()
        serializer = FollowUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        follow_up = serializer.save(customer=customer, created_by=request.user)
        return Response(FollowUpSerializer(follow_up, context=self.get_serializer_context()).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsSiteAdmin])
def crm_summary_view(request):
    queryset = Customer.objects.all()
    total_customers = queryset.count()
    residential_projects = queryset.filter(project_type='Residential').count()
    commercial_projects = queryset.filter(project_type='Commercial').count()
    completed_projects = queryset.filter(construction_status='Completed').count()
    ongoing_projects = queryset.filter(construction_status='Ongoing').count()
    new_leads = queryset.filter(construction_status='New Lead').count()

    project_type_breakdown = [
        {'label': label, 'value': queryset.filter(project_type=value).count()}
        for value, label in Customer.PROJECT_TYPE_CHOICES
    ]

    today = timezone.now().date()
    start_month = (today.replace(day=1) - timedelta(days=330)).replace(day=1)
    monthly_rows = (
        queryset.filter(created_at__date__gte=start_month)
        .annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(total=Count('id'))
        .order_by('month')
    )
    monthly_map = {}
    for row in monthly_rows:
        month_value = row['month']
        if not month_value:
            continue
        if hasattr(month_value, 'date'):
            month_key = month_value.date().replace(day=1)
        else:
            month_key = month_value.replace(day=1)
        monthly_map[month_key] = row['total']

    monthly_growth = []
    current = start_month
    for _ in range(12):
        label = current.strftime('%b %Y')
        monthly_growth.append({'label': label, 'value': monthly_map.get(current, 0)})
        year = current.year + (current.month // 12)
        month = (current.month % 12) + 1
        current = current.replace(year=year, month=month)

    recent_customers = queryset.prefetch_related('project_images', 'documents', 'follow_ups').order_by('-created_at')[:5]

    data = {
        'total_customers': total_customers,
        'residential_projects': residential_projects,
        'commercial_projects': commercial_projects,
        'completed_projects': completed_projects,
        'ongoing_projects': ongoing_projects,
        'new_leads': new_leads,
        'project_type_breakdown': project_type_breakdown,
        'monthly_growth': monthly_growth,
        'recent_customers': recent_customers,
    }

    serializer = CRMReportSerializer(data, context={'request': request})
    return Response(serializer.data)