from django.db import models


class Inquiry(models.Model):
    """Inquiry model for contact form submissions."""
    
    INQUIRY_TYPE_CHOICES = [
        ('construction', 'Construction'),
        ('property', 'Property'),
        ('general', 'General'),
        ('sell', 'Sell'),
        ('build_property', 'Build Property'),
    ]
    
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(null=True, blank=True)
    message = models.TextField()
    property = models.ForeignKey(
        'properties.Property',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='inquiries'
    )
    inquiry_type = models.CharField(max_length=20, choices=INQUIRY_TYPE_CHOICES, default='general')
    image = models.ImageField(upload_to='inquiry_images/', null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'inquiries'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.inquiry_type}"


class SellRequest(models.Model):
    """Model for sell requests from customers."""
    
    PROPERTY_TYPE_CHOICES = [
        ('commercial', 'Commercial'),
        ('residential', 'Residential'),
        ('semi_bungalow', 'Semi Bungalow'),
        ('bungalow', 'Bungalow'),
    ]
    
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    location = models.CharField(max_length=200)
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES)
    asking_price = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    description = models.TextField()
    # Keep single image field for backward compatibility
    images = models.ImageField(upload_to='sell_request_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'sell_requests'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.property_type}"


class SellRequestImage(models.Model):
    """Model for multiple images per sell request."""
    
    sell_request = models.ForeignKey(
        SellRequest,
        on_delete=models.CASCADE,
        related_name='request_images'
    )
    image = models.ImageField(upload_to='sell_request_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'sell_request_images'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"Image for {self.sell_request.name}"
