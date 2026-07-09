from rest_framework import serializers

from accounts.serializers import UserSerializer
from .models import Customer, CustomerDocument, CustomerImage, FollowUp


class CustomerImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = CustomerImage
        fields = ['id', 'caption', 'url', 'created_at']

    def get_url(self, obj):
        request = self.context.get('request')
        if not obj.image:
            return ''
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url


class CustomerDocumentSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = CustomerDocument
        fields = ['id', 'document_type', 'title', 'url', 'created_at']

    def get_url(self, obj):
        request = self.context.get('request')
        if not obj.file:
            return ''
        url = obj.file.url
        return request.build_absolute_uri(url) if request else url


class FollowUpSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = FollowUp
        fields = ['id', 'note', 'next_follow_up_date', 'follow_up_date', 'created_at', 'created_by_name']

    def get_created_by_name(self, obj):
        if obj.created_by and getattr(obj.created_by, 'full_name', ''):
            return obj.created_by.full_name
        if obj.created_by:
            return obj.created_by.email
        return ''


class CustomerListSerializer(serializers.ModelSerializer):
    assigned_engineer_name = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()
    project_image_count = serializers.IntegerField(source='project_images.count', read_only=True)
    document_count = serializers.IntegerField(source='documents.count', read_only=True)
    follow_up_count = serializers.IntegerField(source='follow_ups.count', read_only=True)

    class Meta:
        model = Customer
        fields = [
            'id',
            'full_name',
            'phone_number',
            'alternate_phone',
            'email',
            'city',
            'district',
            'project_type',
            'estimated_budget',
            'construction_status',
            'created_at',
            'assigned_engineer_name',
            'primary_image',
            'project_image_count',
            'document_count',
            'follow_up_count',
        ]

    def get_assigned_engineer_name(self, obj):
        if obj.assigned_engineer and getattr(obj.assigned_engineer, 'full_name', ''):
            return obj.assigned_engineer.full_name
        if obj.assigned_engineer:
            return obj.assigned_engineer.email
        return ''

    def get_primary_image(self, obj):
        first_image = obj.project_images.first()
        if not first_image or not first_image.image:
            return ''
        request = self.context.get('request')
        url = first_image.image.url
        return request.build_absolute_uri(url) if request else url


class CustomerDetailSerializer(CustomerListSerializer):
    assigned_engineer = UserSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    images = CustomerImageSerializer(source='project_images', many=True, read_only=True)
    documents = CustomerDocumentSerializer(many=True, read_only=True)
    follow_ups = FollowUpSerializer(many=True, read_only=True)
    timeline = serializers.SerializerMethodField()

    class Meta(CustomerListSerializer.Meta):
        model = Customer
        fields = CustomerListSerializer.Meta.fields + [
            'address',
            'house_style',
            'number_of_floors',
            'land_size',
            'built_up_area',
            'project_start_date',
            'completion_date',
            'notes',
            'customer_source',
            'updated_at',
            'assigned_engineer',
            'created_by',
            'images',
            'documents',
            'follow_ups',
            'timeline',
        ]

    def get_timeline(self, obj):
        events = [
            {
                'type': 'created',
                'title': 'Customer created',
                'description': obj.customer_source or 'CRM record created',
                'date': obj.created_at,
            }
        ]

        for follow_up in obj.follow_ups.all():
            events.append(
                {
                    'type': 'follow_up',
                    'title': 'Follow-up added',
                    'description': follow_up.note,
                    'date': follow_up.follow_up_date,
                }
            )

        for image in obj.project_images.all():
            events.append(
                {
                    'type': 'image',
                    'title': 'Project image uploaded',
                    'description': image.caption or 'Uploaded project image',
                    'date': image.created_at,
                }
            )

        for document in obj.documents.all():
            events.append(
                {
                    'type': 'document',
                    'title': 'Document uploaded',
                    'description': document.title or document.get_document_type_display(),
                    'date': document.created_at,
                }
            )

        events.sort(key=lambda item: item['date'] or obj.created_at, reverse=True)
        return events


class CustomerWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            'id',
            'full_name',
            'phone_number',
            'alternate_phone',
            'email',
            'address',
            'city',
            'district',
            'project_type',
            'house_style',
            'number_of_floors',
            'land_size',
            'built_up_area',
            'estimated_budget',
            'construction_status',
            'project_start_date',
            'completion_date',
            'notes',
            'assigned_engineer',
            'customer_source',
        ]


class CRMReportSerializer(serializers.Serializer):
    total_customers = serializers.IntegerField()
    residential_projects = serializers.IntegerField()
    commercial_projects = serializers.IntegerField()
    completed_projects = serializers.IntegerField()
    ongoing_projects = serializers.IntegerField()
    new_leads = serializers.IntegerField()
    project_type_breakdown = serializers.ListField(child=serializers.DictField())
    monthly_growth = serializers.ListField(child=serializers.DictField())
    recent_customers = CustomerListSerializer(many=True)