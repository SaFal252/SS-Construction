from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiteSettingsViewSet, ServiceViewSet, TestimonialViewSet, WhyChooseUsViewSet

router = DefaultRouter()
router.register(r'settings', SiteSettingsViewSet, basename='sitesettings')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'why-choose-us', WhyChooseUsViewSet, basename='whychooseus')

urlpatterns = [
    path('', include(router.urls)),
]
