from rest_framework import viewsets, permissions
from .models import SiteSettings, Service, Testimonial, WhyChooseUs
from .serializers import SiteSettingsSerializer, ServiceSerializer, TestimonialSerializer, WhyChooseUsSerializer


class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    lookup_field = 'key'

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        key = self.kwargs.get('key')
        if key:
            return SiteSettings.objects.filter(key=key)
        return SiteSettings.objects.all()


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(is_active=True).order_by('order')
    serializer_class = ServiceSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.filter(is_active=True).order_by('order')
    serializer_class = TestimonialSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class WhyChooseUsViewSet(viewsets.ModelViewSet):
    queryset = WhyChooseUs.objects.filter(is_active=True).order_by('order')
    serializer_class = WhyChooseUsSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
