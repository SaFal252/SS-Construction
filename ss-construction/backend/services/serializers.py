from rest_framework import serializers
from .models import Service

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'features', 'price_range_min', 'price_range_max', 'image', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


from .models import ServiceRequest


class ServiceRequestSerializer(serializers.ModelSerializer):
    service_name = serializers.SerializerMethodField()

    def get_service_name(self, obj):
        return obj.service.name if obj.service else None

    class Meta:
        model = ServiceRequest
        fields = ['id', 'service', 'service_name', 'name', 'email', 'phone', 'details', 'request_type', 'is_read', 'created_at']
        read_only_fields = ['id', 'created_at']
