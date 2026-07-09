from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, ServiceRequestViewSet

router = DefaultRouter()
router.register(r'', ServiceViewSet, basename='service')
router.register(r'requests', ServiceRequestViewSet, basename='service-request')

urlpatterns = [
    path('', include(router.urls)),
]
