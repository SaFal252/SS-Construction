
from django.urls import path, include
from rest_framework.routers import DefaultRouter, SimpleRouter
from . import views

# Separate specific routers to ensure they take priority in urlpatterns
router_specific = SimpleRouter()
router_specific.register(r'build', views.BuildProjectViewSet, basename='buildproject')
router_specific.register(r'images', views.PropertyImageViewSet, basename='propertyimage')
router_specific.register(r'videos', views.PropertyVideoViewSet, basename='propertyvideo')

# The main property router with empty prefix goes last
router_main = DefaultRouter()
router_main.register(r'', views.PropertyViewSet, basename='property')

urlpatterns = [
    # Direct path for image upload
    path('images/upload/', views.PropertyImageUploadView.as_view(), name='property-image-upload'),
    # SPECIFIC routers first (to avoid shadowing by catch-all slug regex)
    path('', include(router_specific.urls)),
    # CATCH-ALL main router last
    path('', include(router_main.urls)),
]
