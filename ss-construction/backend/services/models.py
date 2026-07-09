from django.db import models
from django.utils.text import slugify

class Service(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField()
    features = models.TextField(help_text="Enter features separated by newlines")
    price_range_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    price_range_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='service_images/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Service'
        verbose_name_plural = 'Services'

    def __str__(self):
        return self.name


class ServiceRequest(models.Model):
    """Customer requests for service quotes or consultations."""
    REQUEST_TYPE_CHOICES = [
        ('quote', 'Quote'),
        ('consultation', 'Consultation'),
    ]

    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name='requests')
    name = models.CharField(max_length=200)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    details = models.TextField()
    request_type = models.CharField(max_length=20, choices=REQUEST_TYPE_CHOICES, default='quote')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'service_requests'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.request_type}"
