from rest_framework import serializers
from .models import SiteSettings, Service, Testimonial, WhyChooseUs


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = ['key', 'value', 'updated_at']


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'title', 'description', 'icon', 'order', 'is_active', 'created_at']


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'client_name', 'client_photo', 'rating', 'review', 'is_active', 'order', 'created_at']


class WhyChooseUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhyChooseUs
        fields = ['id', 'title', 'description', 'icon', 'order', 'is_active', 'created_at']
