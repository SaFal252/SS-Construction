from django.contrib import admin

from .models import Customer, CustomerDocument, CustomerImage, FollowUp


class CustomerImageInline(admin.TabularInline):
    model = CustomerImage
    extra = 0


class CustomerDocumentInline(admin.TabularInline):
    model = CustomerDocument
    extra = 0


class FollowUpInline(admin.TabularInline):
    model = FollowUp
    extra = 0


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone_number', 'project_type', 'construction_status', 'city', 'estimated_budget', 'created_at')
    list_filter = ('project_type', 'construction_status', 'city', 'district', 'created_at')
    search_fields = ('full_name', 'phone_number', 'email', 'city', 'district', 'notes')
    inlines = [CustomerImageInline, CustomerDocumentInline, FollowUpInline]


@admin.register(CustomerImage)
class CustomerImageAdmin(admin.ModelAdmin):
    list_display = ('customer', 'caption', 'created_at')
    search_fields = ('customer__full_name', 'caption')


@admin.register(CustomerDocument)
class CustomerDocumentAdmin(admin.ModelAdmin):
    list_display = ('customer', 'document_type', 'title', 'created_at')
    search_fields = ('customer__full_name', 'title')


@admin.register(FollowUp)
class FollowUpAdmin(admin.ModelAdmin):
    list_display = ('customer', 'follow_up_date', 'next_follow_up_date', 'created_by')
    search_fields = ('customer__full_name', 'note')