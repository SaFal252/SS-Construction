import django_filters
from django.db.models import DateField

from .models import Customer


class CustomerFilter(django_filters.FilterSet):
    project_type = django_filters.CharFilter(field_name='project_type', lookup_expr='iexact')
    construction_status = django_filters.CharFilter(field_name='construction_status', lookup_expr='iexact')
    city = django_filters.CharFilter(field_name='city', lookup_expr='iexact')
    district = django_filters.CharFilter(field_name='district', lookup_expr='iexact')
    assigned_engineer = django_filters.NumberFilter(field_name='assigned_engineer_id')
    budget_min = django_filters.NumberFilter(method='filter_budget_min')
    budget_max = django_filters.NumberFilter(method='filter_budget_max')
    created_from = django_filters.DateFilter(method='filter_created_from')
    created_to = django_filters.DateFilter(method='filter_created_to')

    class Meta:
        model = Customer
        fields = [
            'project_type',
            'construction_status',
            'city',
            'district',
            'assigned_engineer',
            'budget_min',
            'budget_max',
            'created_from',
            'created_to',
        ]

    def filter_budget_min(self, queryset, name, value):
        return queryset.filter(estimated_budget__gte=value)

    def filter_budget_max(self, queryset, name, value):
        return queryset.filter(estimated_budget__lte=value)

    def filter_created_from(self, queryset, name, value):
        return queryset.filter(created_at__date__gte=value)

    def filter_created_to(self, queryset, name, value):
        return queryset.filter(created_at__date__lte=value)