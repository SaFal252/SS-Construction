from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CustomerViewSet, crm_summary_view


router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='crm-customers')

urlpatterns = [
    path('', include(router.urls)),
    path('reports/summary/', crm_summary_view, name='crm-summary'),
]