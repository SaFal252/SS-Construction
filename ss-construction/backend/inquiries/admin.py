from django.contrib import admin
from .models import Inquiry, SellRequest


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    """Admin configuration for Inquiry model."""
    list_display = ['name', 'email', 'phone', 'inquiry_type', 'is_read', 'created_at']
    list_filter = ['inquiry_type', 'is_read', 'created_at']
    search_fields = ['name', 'email', 'message']
    ordering = ['-created_at']
    list_editable = ['is_read']


@admin.register(SellRequest)
class SellRequestAdmin(admin.ModelAdmin):
    """Admin configuration for SellRequest model."""
    list_display = ['name', 'email', 'phone', 'property_type', 'location', 'asking_price', 'created_at']
    list_filter = ['property_type', 'created_at']
    search_fields = ['name', 'email', 'location', 'description']
    ordering = ['-created_at']
