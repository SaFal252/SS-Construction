from django.conf import settings
from django.db import models


class Customer(models.Model):
    PROJECT_TYPE_CHOICES = [
        ('Residential', 'Residential'),
        ('Commercial', 'Commercial'),
        ('Bangalow', 'Bangalow'),
        ('Semi-Bangalow', 'Semi-Bangalow'),
    ]

    STATUS_CHOICES = [
        ('New Lead', 'New Lead'),
        ('Ongoing', 'Ongoing'),
        ('Completed', 'Completed'),
        ('On Hold', 'On Hold'),
    ]

    full_name = models.CharField(max_length=200, db_index=True)
    phone_number = models.CharField(max_length=20, db_index=True)
    alternate_phone = models.CharField(max_length=20, blank=True, default='')
    email = models.EmailField(blank=True, default='', db_index=True)
    address = models.TextField(blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='', db_index=True)
    district = models.CharField(max_length=100, blank=True, default='', db_index=True)
    project_type = models.CharField(max_length=50, choices=PROJECT_TYPE_CHOICES, db_index=True)
    house_style = models.CharField(max_length=150, blank=True, default='')
    number_of_floors = models.PositiveIntegerField(default=0)
    land_size = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    built_up_area = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    estimated_budget = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True, db_index=True)
    construction_status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='New Lead', db_index=True)
    project_start_date = models.DateField(null=True, blank=True)
    completion_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True, default='')
    assigned_engineer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='crm_customers',
    )
    customer_source = models.CharField(max_length=150, blank=True, default='')
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='crm_customers_created',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'crm_customers'
        ordering = ['-created_at']

    def __str__(self):
        return self.full_name


class CustomerImage(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='project_images')
    image = models.ImageField(upload_to='crm/customer_images/')
    caption = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'crm_customer_images'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.customer.full_name} image'


class CustomerDocument(models.Model):
    DOCUMENT_TYPE_CHOICES = [
        ('blueprint', 'Blueprint PDF'),
        ('agreement', 'Agreement PDF'),
        ('other', 'Other Document'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPE_CHOICES, default='other')
    title = models.CharField(max_length=255, blank=True, default='')
    file = models.FileField(upload_to='crm/customer_documents/')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'crm_customer_documents'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.customer.full_name} document'


class FollowUp(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='follow_ups')
    note = models.TextField()
    next_follow_up_date = models.DateField(null=True, blank=True)
    follow_up_date = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='crm_followups_created',
    )

    class Meta:
        db_table = 'crm_follow_ups'
        ordering = ['-follow_up_date']

    def __str__(self):
        return f'{self.customer.full_name} follow-up'