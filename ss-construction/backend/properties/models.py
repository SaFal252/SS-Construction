

from django.db import models
from django.utils.text import slugify
from django.conf import settings

# Place PropertyVideo model at the end of the file, after all imports and other models

# ... (other model classes remain unchanged above) ...

class PropertyVideo(models.Model):
    """Model for admin-uploaded property videos to display on the home section."""
    title = models.CharField(max_length=200, blank=True, help_text='Optional title for the video')
    video = models.FileField(upload_to='property_videos/', help_text='Upload video file')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True, help_text='Show this video on the homepage')

    class Meta:
        db_table = 'property_videos'
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.title or f"Video {self.id}"


class Property(models.Model):
    """Property model for houses Buy/Sell listings."""
    
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('Sold', 'Sold'),
        ('Pending', 'Pending'),
    ]
    
    TYPE_CHOICES = [
        ('Commercial', 'Commercial'),
        ('Residential', 'Residential'),
        ('Semi Bangalow', 'Semi Bangalow'),
        ('Bangalow', 'Bangalow'),
        ('Villa', 'Villa'),
        ('Apartment', 'Apartment'),
        ('Penthouse', 'Penthouse'),
        ('Townhouse', 'Townhouse'),
        ('Duplex', 'Duplex'),
        ('Studio', 'Studio'),
        ('Cottage', 'Cottage'),
        ('Mansion', 'Mansion'),
        ('House', 'House'),
        ('Land', 'Land'),
    ]
    
    SIZE_UNIT_CHOICES = [
        ('Aana', 'Aana'),
        ('Sqft', 'Sqft'),
        ('Ropani', 'Ropani'),
    ]
    
    FEATURE_CHOICES = [
        ('Pool', 'Pool'),
        ('Garden', 'Garden'),
        ('Parking', 'Parking'),
        ('Gym', 'Gym'),
        ('Balcony', 'Balcony'),
        ('Security', 'Security'),
        ('Elevator', 'Elevator'),
        ('Rooftop', 'Rooftop'),
        ('Fireplace', 'Fireplace'),
        ('Smart Home', 'Smart Home'),
        ('Tennis Court', 'Tennis Court'),
        ('Home Theater', 'Home Theater'),
    ]
    
    title = models.CharField(max_length=200, blank=True, null=True)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    price = models.DecimalField(max_digits=15, decimal_places=2, help_text='Price in NPR', null=True, blank=True)
    size = models.DecimalField(max_digits=10, decimal_places=2, help_text='Size of the property', null=True, blank=True)
    size_unit = models.CharField(max_length=10, choices=SIZE_UNIT_CHOICES, default='Sqft')
    location = models.CharField(max_length=200, blank=True, null=True)
    bedrooms = models.IntegerField(default=0, null=True, blank=True)
    bathrooms = models.IntegerField(default=0, null=True, blank=True)
    area = models.IntegerField(default=0, null=True, blank=True, help_text='Area in sqft')
    description = models.TextField(blank=True, null=True)
    house_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='House')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Available')
    is_featured = models.BooleanField(default=False, help_text='Show on homepage as featured property')
    is_new = models.BooleanField(default=False, help_text='Mark as new property')
    features = models.JSONField(default=list, help_text='List of features: Pool, Garden, Parking, etc.')
    image = models.ImageField(upload_to='property_images/', null=True, blank=True, help_text='Main property image')
    
    # Additional fields for detail page
    road_access = models.BooleanField(default=False, help_text='Road access available')
    parking = models.BooleanField(default=False, help_text='Parking available')
    land_size = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text='Land size in sqft')
    built_area = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text='Built area in sqft')
    build = models.IntegerField(null=True, blank=True, help_text='Year built')
    
    # Nepal-specific fields
    face_direction = models.CharField(max_length=20, blank=True, help_text='Face direction: East, West, North, South')
    lalpurja_status = models.CharField(max_length=20, blank=True, help_text='Lalpurja status: Available, In process, Not available')
    napi_done = models.CharField(max_length=20, blank=True, help_text='Napi done: Yes, No, In process')
    posted_by_name = models.CharField(max_length=100, blank=True, help_text='Owner/Agent name')
    posted_by_phone = models.CharField(max_length=20, blank=True, help_text='Phone number in Nepal format')
    floors = models.IntegerField(default=1, null=True, blank=True, help_text='Number of floors')
    
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='properties', null=True, blank=True)
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'properties'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Property.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)


class PropertyImage(models.Model):
    """Additional images for properties."""
    
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField()
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'property_images'
        ordering = ['-is_primary', '-created_at']
    
    def __str__(self):
        return f"{self.property.title} - {'Primary' if self.is_primary else 'Image'}"


class BuildProject(models.Model):
    """Build/Construction project model for build services."""
    
    BUILD_TYPE_CHOICES = [
        ('Residential', 'Residential'),
        ('Commercial', 'Commercial'),
        ('Mixed', 'Mixed'),
    ]
    
    STATUS_CHOICES = [
        ('Planning', 'Planning'),
        ('In Progress', 'In Progress'),
        ('Ready to Build', 'Ready to Build'),
    ]
    
    DESIGN_STYLE_CHOICES = [
        ('Modern', 'Modern'),
        ('Traditional', 'Traditional'),
        ('Contemporary', 'Contemporary'),
        ('Minimalist', 'Minimalist'),
    ]
    
    title = models.CharField(max_length=200, help_text='Project name')
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    location = models.CharField(max_length=200, help_text='Location in Kathmandu/Tokha')
    plot_size = models.CharField(max_length=100, help_text='Plot size e.g. 5 Aana, 10 Ropani')
    estimated_budget = models.DecimalField(max_digits=15, decimal_places=2, help_text='Estimated budget in NPR')
    build_type = models.CharField(max_length=20, choices=BUILD_TYPE_CHOICES, default='Residential')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Planning')
    floors = models.IntegerField(default=1, help_text='Number of floors')
    parking_spaces = models.IntegerField(default=0, help_text='Number of parking spaces')
    design_style = models.CharField(max_length=20, choices=DESIGN_STYLE_CHOICES, default='Modern')
    description = models.TextField(blank=True, help_text='Project description')
    image = models.ImageField(upload_to='build_projects/', null=True, blank=True, help_text='Project image')
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'build_projects'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while BuildProject.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
