from rest_framework import viewsets, status, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.authentication import SessionAuthentication
from django.http import HttpResponse
from .models import Inquiry, SellRequest, SellRequestImage
from .serializers import (
    InquirySerializer, 
    InquiryCreateSerializer,
    SellRequestSerializer,
    SellRequestCreateSerializer
)
from .emails import send_inquiry_notification, send_sell_request_notification


class InquiryViewSet(viewsets.ModelViewSet):
    """ViewSet for Inquiry CRUD operations."""
    queryset = Inquiry.objects.all()
    http_method_names = ['get', 'post', 'patch', 'delete', 'options', 'head']
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['inquiry_type', 'is_read']
    search_fields = ['name', 'email', 'phone', 'message', 'property__title']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """Allow unauthenticated create action and restrict other actions to admins."""
        action = getattr(self, 'action', None)
        if action == 'create':
            return [AllowAny()]
        # All other actions (list, retrieve, update, delete, mark_read, export, my_inquiries) 
        # should be at least authenticated, and most admin-only
        if action in ['list', 'retrieve', 'update', 'partial_update', 'destroy', 'mark_read', 'export']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_authenticators(self):
        """Allow unauthenticated create action."""
        # Check action from the request
        action = getattr(self, 'action', None)
        if action == 'create':
            return []
        return super().get_authenticators()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return InquiryCreateSerializer
        return InquirySerializer

    def perform_create(self, serializer):
        inquiry = serializer.save()
        # Send email notification to admin
        send_inquiry_notification(inquiry)

    @action(detail=True, methods=['post', 'patch'], permission_classes=[IsAuthenticated])
    def mark_read(self, request, pk=None):
        """Mark inquiry as read."""
        inquiry = self.get_object()
        inquiry.is_read = True
        inquiry.save()
        return Response(InquirySerializer(inquiry).data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def export(self, request):
        """Export inquiries as CSV."""
        inquiries = self.queryset.all()
        
        # Create CSV response
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="inquiries.csv"'
        
        # Write CSV header
        response.write('ID,Name,Email,Phone,Type,Property,Message,Is Read,Created At\n')
        
        # Write data
        for inquiry in inquiries:
            response.write(f'{inquiry.id},"{inquiry.name}","{inquiry.email}","{inquiry.phone}","{inquiry.inquiry_type}","{inquiry.property.title if inquiry.property else ""}","{inquiry.message or ""}",{inquiry.is_read},{inquiry.created_at}\n')
        
        return response

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_inquiries(self, request):
        """Get only the current user's inquiries."""
        # Get inquiries where the email matches the logged-in user's email
        inquiries = self.queryset.filter(email=request.user.email)
        serializer = InquirySerializer(inquiries, many=True)
        return Response(serializer.data)


class SellRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for SellRequest CRUD operations."""
    queryset = SellRequest.objects.all()
    http_method_names = ['get', 'post', 'patch', 'delete', 'options', 'head']
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['property_type']
    search_fields = ['name', 'email', 'phone', 'location', 'description']
    ordering_fields = ['created_at', 'asking_price']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """Allow unauthenticated create action and restrict other actions to admins."""
        action = getattr(self, 'action', None)
        if action == 'create':
            return [AllowAny()]
        if action in ['list', 'retrieve', 'update', 'partial_update', 'destroy', 'export']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_authenticators(self):
        """Allow unauthenticated create action."""
        action = getattr(self, 'action', None)
        if action == 'create':
            return []
        return super().get_authenticators()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return SellRequestCreateSerializer
        return SellRequestSerializer

    def create(self, request, *args, **kwargs):
        # Handle multiple images
        images = request.FILES.getlist('images')
        # Keep the primary image for the main field
        primary_image = images[0] if images else None
        
        # Create data dict for serializer
        data = {
            'name': request.data.get('name'),
            'phone': request.data.get('phone'),
            'email': request.data.get('email'),
            'location': request.data.get('location'),
            'property_type': request.data.get('property_type'),
            'asking_price': request.data.get('asking_price'),
            'description': request.data.get('description'),
            'images': primary_image,
        }
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        sell_request = serializer.save()
        
        # Save additional images to SellRequestImage model
        for i, img in enumerate(images):
            if i > 0:  # Skip first as it's already saved in main field
                SellRequestImage.objects.create(sell_request=sell_request, image=img)
        
        # Send email notification to admin
        send_sell_request_notification(sell_request)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        sell_request = serializer.save()
        # Send email notification to admin
        send_sell_request_notification(sell_request)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def export(self, request):
        """Export sell requests as CSV."""
        requests = self.queryset.all()
        
        # Create CSV response
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="sell_requests.csv"'
        
        # Write CSV header
        response.write('ID,Name,Email,Phone,Location,Property Type,Asking Price,Description,Created At\n')
        
        # Write data
        for req in requests:
            response.write(f'{req.id},"{req.name}","{req.email}","{req.phone}","{req.location}","{req.property_type}",{req.asking_price or 0},"{req.description or ""}",{req.created_at}\n')
        
        return response

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_sell_requests(self, request):
        """Get only the current user's sell requests."""
        requests = self.queryset.filter(email=request.user.email)
        serializer = SellRequestSerializer(requests, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def convert_to_property(self, request, pk=None):
        """Convert a sell request to a property listing automatically."""
        from properties.models import Property, PropertyImage
        from django.core.files import File
        from django.core.files.base import ContentFile
        import urllib.request
        import io
        
        sell_request = self.get_object()
        
        # Create property from sell request
        property_obj = Property.objects.create(
            title=f"Property in {sell_request.location}",
            price=sell_request.asking_price or 0,
            location=sell_request.location,
            house_type=sell_request.property_type.capitalize() if sell_request.property_type else 'House',
            description=sell_request.description,
            status='Available',
            posted_by=request.user,
        )
        
        # Copy image if exists
        if sell_request.images:
            try:
                # Download the image from sell request
                img_url = sell_request.images.url
                if img_url.startswith('/'):
                    # Local file
                    img_path = sell_request.images.path
                    with open(img_path, 'rb') as f:
                        property_obj.image.save(
                            sell_request.images.name.split('/')[-1],
                            File(f)
                        )
                else:
                    # Remote URL - download it
                    with urllib.request.urlopen(img_url) as response:
                        img_data = response.read()
                        img_name = img_url.split('/')[-1].split('?')[0]
                        property_obj.image.save(img_name, ContentFile(img_data))
            except Exception as e:
                pass  # Skip image if fails
        
        return Response({'success': True, 'property_id': property_obj.id, 'property_slug': property_obj.slug})
