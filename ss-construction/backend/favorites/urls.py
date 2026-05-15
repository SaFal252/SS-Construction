from django.urls import path, include
from rest_framework.routers import DefaultRouter
from favorites.views import FavoriteViewSet, PropertyComparisonViewSet

router = DefaultRouter()
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'comparisons', PropertyComparisonViewSet, basename='comparison')

urlpatterns = [
    path('', include(router.urls)),
]
