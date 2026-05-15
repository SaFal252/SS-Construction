from rest_framework import serializers
from favorites.models import Favorite, PropertyComparison
from properties.models import Property
from properties.serializers import PropertySerializer


class FavoriteSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)
    property_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'property', 'property_id', 'created_at']
        read_only_fields = ['id', 'created_at']


class PropertyComparisonSerializer(serializers.ModelSerializer):
    properties = PropertySerializer(many=True, read_only=True)
    property_ids = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(),
        many=True,
        write_only=True,
        source='properties'
    )
    
    class Meta:
        model = PropertyComparison
        fields = ['id', 'properties', 'property_ids', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
