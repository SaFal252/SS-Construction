from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from favorites.models import Favorite, PropertyComparison
from favorites.serializers import FavoriteSerializer, PropertyComparisonSerializer
from properties.models import Property


class FavoriteViewSet(viewsets.ModelViewSet):
    """
    API ViewSet for managing user favorite properties.
    
    Endpoints:
    - GET /api/favorites/ - List user's favorites
    - POST /api/favorites/ - Add a property to favorites
    - DELETE /api/favorites/{id}/ - Remove from favorites
    - GET /api/favorites/is-favorite/{property_id}/ - Check if property is favorited
    """
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return only current user's favorites."""
        return Favorite.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Create a new favorite for the current user."""
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """Add a property to favorites."""
        property_id = request.data.get('property_id')
        
        try:
            property_obj = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response(
                {'error': 'Property not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if already favorited
        if Favorite.objects.filter(user=request.user, property=property_obj).exists():
            return Response(
                {'error': 'Already in favorites'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        favorite = Favorite.objects.create(
            user=request.user,
            property=property_obj
        )
        
        serializer = self.get_serializer(favorite)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, *args, **kwargs):
        """Remove a property from favorites."""
        favorite = self.get_object()
        favorite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'])
    def is_favorite(self, request, property_id=None):
        """Check if a property is in user's favorites."""
        property_id = request.query_params.get('property_id')
        
        if not property_id:
            return Response(
                {'error': 'property_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        is_favorite = Favorite.objects.filter(
            user=request.user,
            property_id=property_id
        ).exists()
        
        return Response({'is_favorite': is_favorite})
    
    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """Toggle favorite status of a property."""
        property_id = request.data.get('property_id')
        
        if not property_id:
            return Response(
                {'error': 'property_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            property_obj = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response(
                {'error': 'Property not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            property=property_obj
        )
        
        if not created:
            favorite.delete()
            return Response({'status': 'removed'}, status=status.HTTP_200_OK)
        
        serializer = self.get_serializer(favorite)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def count(self, request):
        """Get count of user's favorites."""
        count = Favorite.objects.filter(user=request.user).count()
        return Response({'count': count})


class PropertyComparisonViewSet(viewsets.ModelViewSet):
    """
    API ViewSet for managing property comparisons.
    
    Endpoints:
    - GET /api/comparisons/ - List user's comparisons
    - POST /api/comparisons/ - Create a new comparison
    - GET /api/comparisons/{id}/ - Get comparison details
    """
    serializer_class = PropertyComparisonSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return only current user's comparisons."""
        return PropertyComparison.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Create a new comparison for the current user."""
        serializer.save(user=self.request.user)
