
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Property, PropertyImage, BuildProject, PropertyVideo
from .serializers import PropertySerializer, PropertyListSerializer, PropertyImageSerializer, BuildProjectSerializer, PropertyVideoSerializer


class PropertyVideoViewSet(viewsets.ModelViewSet):
    """ViewSet for CRUD and public listing of property videos."""
    queryset = PropertyVideo.objects.all()
    serializer_class = PropertyVideoSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]

    def get_queryset(self):
        if self.action == 'list' and not self.request.user.is_staff:
            return self.queryset.filter(is_active=True).order_by('-uploaded_at')[:10]
        return self.queryset


class PropertyViewSet(viewsets.ModelViewSet):
    """ViewSet for Property CRUD operations."""
    queryset = Property.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'house_type', 'bedrooms', 'bathrooms', 'size_unit']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['created_at', 'price', 'size']
    ordering = ['-created_at']
    lookup_field = 'slug'
    
    def get_object(self):
        """Allow lookup by both slug and pk."""
        lookup_value = self.kwargs.get(self.lookup_field, self.kwargs.get('pk'))
        
        if not lookup_value:
            from django.http import Http404
            raise Http404()
        
        try:
            return self.queryset.get(slug=lookup_value)
        except (Property.DoesNotExist, ValueError):
            try:
                return self.queryset.get(pk=int(lookup_value))
            except (Property.DoesNotExist, ValueError):
                from django.http import Http404
                raise Http404()

    def get_serializer_class(self):
        if self.action == 'list':
            return PropertyListSerializer
        return PropertySerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticatedOrReadOnly()]
        return super().get_permissions()
    
    def get_queryset(self):
        # Show Available and Pending properties to everyone
        if self.action == 'list' and not self.request.user.is_staff:
            return self.queryset.filter(status__in=['Available', 'Pending'])
        return self.queryset

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user, status='Pending')

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured properties (approved only, marked as featured)."""
        featured = self.queryset.filter(status='Approved', is_featured=True)[:6]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get available (approved) properties."""
        available = self.queryset.filter(status='Approved')
        serializer = self.get_serializer(available, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_properties(self, request):
        """Get current user's properties."""
        properties = self.queryset.filter(posted_by=request.user)
        serializer = self.get_serializer(properties, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def approved(self, request):
        """Get all approved properties (public)."""
        properties = self.queryset.filter(status='Approved')
        serializer = self.get_serializer(properties, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser], permission_classes=[IsAuthenticated])
    def upload_image(self, request, slug=None):
        """Upload image for a property."""
        property = self.get_object()
        image = request.FILES.get('image')
        if not image:
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        is_primary_raw = request.data.get('is_primary', 'false')
        is_primary = is_primary_raw if isinstance(is_primary_raw, bool) else str(is_primary_raw).lower() == 'true'
        
        if is_primary:
            PropertyImage.objects.filter(property=property, is_primary=True).update(is_primary=False)
        
        from django.core.files.storage import default_storage
        import uuid
        import os
        ext = os.path.splitext(image.name)[1]
        new_filename = f"{uuid.uuid4().hex}{ext}"
        file_path = f"property_images/{new_filename}"
        saved_path = default_storage.save(file_path, image)
        
        from django.conf import settings
        image_url = f"{settings.MEDIA_URL}property_images/{new_filename}"
        
        property_image = PropertyImage.objects.create(
            property=property,
            image_url=image_url,
            is_primary=is_primary
        )
        serializer = PropertyImageSerializer(property_image)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='images/(?P<image_id>[^/.]+)', permission_classes=[IsAuthenticated])
    def delete_image(self, request, slug=None, image_id=None):
        """Delete an image from a property."""
        try:
            image = PropertyImage.objects.get(id=image_id, property__slug=slug)
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except PropertyImage.DoesNotExist:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)


class PropertyImageUploadView(APIView):
    """API View for uploading property images."""
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAdminUser]

    def post(self, request):
        """Upload an image for a property."""
        property_id = request.data.get('property_id')
        image = request.FILES.get('image')

        if not property_id:
            return Response({'error': 'property_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not image:
            return Response({'error': 'image is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            property_obj = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response({'error': 'Property not found'}, status=status.HTTP_404_NOT_FOUND)

        is_primary_raw = request.data.get('is_primary', 'false')
        is_primary = is_primary_raw if isinstance(is_primary_raw, bool) else str(is_primary_raw).lower() == 'true'

        if is_primary:
            PropertyImage.objects.filter(property=property_obj, is_primary=True).update(is_primary=False)

        from django.core.files.storage import default_storage
        import uuid
        import os
        ext = os.path.splitext(image.name)[1]
        new_filename = f"{uuid.uuid4().hex}{ext}"
        file_path = f"property_images/{new_filename}"
        saved_path = default_storage.save(file_path, image)
        
        from django.conf import settings
        image_url = f"{settings.MEDIA_URL}property_images/{new_filename}"
        
        property_image = PropertyImage.objects.create(
            property=property_obj,
            image_url=image_url,
            is_primary=is_primary
        )
        
        serializer = PropertyImageSerializer(property_image)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PropertyImageViewSet(viewsets.ModelViewSet):
    """ViewSet for PropertyImage CRUD operations."""
    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]


class BuildProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for BuildProject CRUD operations."""
    queryset = BuildProject.objects.all()
    serializer_class = BuildProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['build_type', 'status', 'design_style']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['created_at', 'estimated_budget']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]