from django.contrib import admin
from favorites.models import Favorite, PropertyComparison


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'property', 'created_at']
    list_filter = ['created_at', 'user']
    search_fields = ['user__email', 'property__title']
    ordering = ['-created_at']


@admin.register(PropertyComparison)
class PropertyComparisonAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__email']
    ordering = ['-updated_at']
