from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Use a single router to properly register all viewsets
# Register sell-requests first since it has a prefix
router = DefaultRouter()
router.register(r'sell-requests', views.SellRequestViewSet, basename='sellrequest')
router.register(r'', views.InquiryViewSet, basename='inquiry')

urlpatterns = [
    path('', include(router.urls)),
]
