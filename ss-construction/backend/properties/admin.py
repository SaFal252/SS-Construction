
from django.contrib import admin
from .models import Property, PropertyImage, BuildProject, PropertyVideo

@admin.register(PropertyVideo)
class PropertyVideoAdmin(admin.ModelAdmin):
    """Admin configuration for PropertyVideo model."""
    list_display = ['title', 'video', 'is_active', 'uploaded_at']
    list_filter = ['is_active']
    search_fields = ['title']
    ordering = ['-uploaded_at']


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    fields = ['image_url', 'is_primary']


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    """Admin configuration for Property model."""
    list_display = ['title', 'price', 'location', 'house_type', 'status', 'is_featured', 'bedrooms', 'bathrooms', 'created_at']
    list_filter = ['status', 'house_type', 'is_featured', 'bedrooms', 'bathrooms']
    search_fields = ['title', 'description', 'location']
    ordering = ['-created_at']
    list_editable = ['status', 'is_featured']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [PropertyImageInline]
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'price', 'size', 'size_unit', 'location', 'house_type', 'status', 'image')
        }),
        ('Details', {
            'fields': ('bedrooms', 'bathrooms', 'area', 'description', 'build', 'land_size', 'built_area')
        }),
        ('Features', {
            'fields': ('features', 'road_access', 'parking')
        }),
        ('Status', {
            'fields': ('is_featured', 'is_new')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description')
        }),
        ('User', {
            'fields': ('posted_by',)
        }),
    )


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    """Admin configuration for PropertyImage model."""
    list_display = ['property', 'is_primary', 'created_at']
    list_filter = ['is_primary']
    ordering = ['-is_primary', '-created_at']


@admin.register(BuildProject)
class BuildProjectAdmin(admin.ModelAdmin):
    """Admin configuration for BuildProject model."""
    list_display = ['title', 'location', 'build_type', 'status', 'estimated_budget', 'is_featured', 'created_at']
    list_filter = ['build_type', 'status', 'design_style', 'is_featured']
    search_fields = ['title', 'description', 'location']
    ordering = ['-created_at']
    list_editable = ['status', 'is_featured']
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'location', 'plot_size', 'image')
        }),
        ('Project Details', {
            'fields': ('estimated_budget', 'build_type', 'status', 'floors', 'parking_spaces', 'design_style')
        }),
        ('Description', {
            'fields': ('description',)
        }),
        ('Status', {
            'fields': ('is_featured',)
        }),
    )
