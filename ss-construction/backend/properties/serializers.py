from rest_framework import serializers
from django.conf import settings
from .models import Property, PropertyImage, BuildProject, PropertyVideo

class PropertyVideoSerializer(serializers.ModelSerializer):
    """Serializer for PropertyVideo model."""
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyVideo
        fields = ['id', 'title', 'video', 'video_url', 'is_active', 'uploaded_at']

    def get_video_url(self, obj):
        request = self.context.get('request')
        if obj.video and hasattr(obj.video, 'url'):
            url = obj.video.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        return None


def get_full_image_url(url, request=None):
    """Convert relative URL to full URL."""
    if not url:
        return None
    # If it's already a full URL, return as is
    if url.startswith('http'):
        return url
    
    # Get the base URL from request or construct it
    if request:
        base_url = request.build_absolute_uri('/')[:-1]  # Remove trailing slash
    else:
        # Fallback: assume localhost:8000
        base_url = 'http://localhost:8000'
    
    # Clean the URL - remove leading slashes
    clean_url = url.lstrip('/')
    return f"{base_url}/{clean_url}"


class PropertyImageSerializer(serializers.ModelSerializer):
    """Serializer for PropertyImage model."""
    
    class Meta:
        model = PropertyImage
        fields = ['id', 'image_url', 'is_primary', 'created_at']
    
    def to_representation(self, instance):
        """Return full URL for image."""
        data = super().to_representation(instance)
        request = self.context.get('request')
        data['image_url'] = get_full_image_url(instance.image_url, request)
        return data


class PropertySerializer(serializers.ModelSerializer):
    """Serializer for Property model."""
    images = PropertyImageSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    posted_by_name = serializers.SerializerMethodField()
    
    title = serializers.CharField(required=False, allow_blank=True, default='')
    price = serializers.DecimalField(max_digits=15, decimal_places=2, required=False, allow_null=True, default=None)
    location = serializers.CharField(required=False, allow_blank=True, default='')
    description = serializers.CharField(required=False, allow_blank=True, default='')
    size = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True, default=None)
    area = serializers.IntegerField(required=False, allow_null=True, default=None)
    bedrooms = serializers.IntegerField(required=False, allow_null=True, default=None)
    bathrooms = serializers.IntegerField(required=False, allow_null=True, default=None)
    
    class Meta:
        model = Property
        fields = [
            'id', 'title', 'slug', 'price', 'size', 'size_unit', 'location',
            'bedrooms', 'bathrooms', 'area', 'description', 'house_type', 'status', 
            'posted_by', 'posted_by_name', 'meta_title',
            'meta_description', 'images', 'primary_image', 'image',
            # Additional fields for detail page
            'road_access', 'parking', 'land_size', 'built_area', 'build',
            # Nepal-specific fields
            'face_direction', 'lalpurja_status', 'napi_done', 'floors',
            'posted_by_name', 'posted_by_phone',
            'created_at', 'updated_at', 'is_featured', 'is_new', 'features'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def to_internal_value(self, data):
        """Convert empty strings to empty strings (not None) before validation."""
        for field_name in data:
            if data[field_name] == '':
                # Keep as empty string instead of converting to None
                pass
        return super().to_internal_value(data)
    
    def validate(self, attrs):
        """Keep empty strings as empty strings for CharFields."""
        return attrs
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            return get_full_image_url(primary.image_url, request)
        return None
    
    def get_posted_by_name(self, obj):
        if obj.posted_by:
            return obj.posted_by.full_name
        return None


class PropertyListSerializer(serializers.ModelSerializer):
    """Simplified serializer for property listings."""
    primary_image = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = [
            'id', 'title', 'slug', 'price', 'size', 'size_unit', 'location',
            'bedrooms', 'bathrooms', 'area', 'house_type', 'status', 'build',
            'primary_image', 'images', 'created_at', 'is_featured', 'is_new', 'features', 'image',
            # Nepal-specific fields
            'face_direction', 'floors', 'road_access'
        ]
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            return get_full_image_url(primary.image_url, request)
        return None
    
    def get_images(self, obj):
        """Return images array with full URLs."""
        images = obj.images.all()
        request = self.context.get('request')
        return PropertyImageSerializer(images, many=True, context={'request': request}).data


class BuildProjectSerializer(serializers.ModelSerializer):
    """Serializer for BuildProject model."""
    
    class Meta:
        model = BuildProject
        fields = [
            'id', 'title', 'slug', 'location', 'plot_size', 'estimated_budget',
            'build_type', 'status', 'floors', 'parking_spaces', 'design_style',
            'description', 'image', 'is_featured', 'created_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at']
