from rest_framework import serializers
from .models import Inquiry, SellRequest, SellRequestImage


class InquirySerializer(serializers.ModelSerializer):
    """Serializer for Inquiry model."""
    property_title = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    
    def get_property_title(self, obj):
        if obj.property:
            return obj.property.title
        return None
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    class Meta:
        model = Inquiry
        fields = [
            'id', 'name', 'phone', 'email', 'message',
            'property', 'property_title', 'inquiry_type',
            'image', 'image_url', 'is_read', 'created_at'
        ]
        read_only_fields = ['id', 'is_read', 'created_at']


class InquiryCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating inquiries."""
    
    class Meta:
        model = Inquiry
        fields = [
            'name', 'phone', 'email', 'message',
            'property', 'inquiry_type', 'image'
        ]


class SellRequestImageSerializer(serializers.ModelSerializer):
    """Serializer for SellRequestImage model."""
    image_url = serializers.SerializerMethodField()
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    class Meta:
        model = SellRequestImage
        fields = ['id', 'image', 'image_url', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class SellRequestSerializer(serializers.ModelSerializer):
    """Serializer for SellRequest model."""
    image_url = serializers.SerializerMethodField()
    images_list = serializers.SerializerMethodField()
    
    class Meta:
        model = SellRequest
        fields = [
            'id', 'name', 'phone', 'email', 'location',
            'property_type', 'asking_price', 'description',
            'images', 'image_url', 'images_list', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_image_url(self, obj):
        if obj.images:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.images.url)
            return obj.images.url
        return None
    
    def get_images_list(self, obj):
        """Get list of all images for this sell request."""
        request = self.context.get('request')
        result = []
        
        # Add the main image first
        if obj.images:
            if request:
                result.append(request.build_absolute_uri(obj.images.url))
            else:
                result.append(obj.images.url)
        
        # Add additional images from SellRequestImage model
        images = obj.request_images.all()
        for img in images:
            if request:
                result.append(request.build_absolute_uri(img.image.url))
            else:
                result.append(img.image.url)
        return result


class SellRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating sell requests."""
    
    class Meta:
        model = SellRequest
        fields = [
            'name', 'phone', 'email', 'location',
            'property_type', 'asking_price', 'description', 'images'
        ]
