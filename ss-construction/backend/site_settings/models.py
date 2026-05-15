from django.db import models


class SiteSettings(models.Model):
    """Site-wide settings like stats numbers."""
    key = models.CharField(max_length=100, unique=True)
    value = models.CharField(max_length=500)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.key
    
    class Meta:
        db_table = 'site_settings'
        verbose_name = 'Site Setting'
        verbose_name_plural = 'Site Settings'


class Service(models.Model):
    """Services offered by SS Construction."""
    ICON_CHOICES = [
        ('hammer', 'Hammer/Construction'),
        ('home', 'Home/Real Estate'),
        ('paintbrush', 'Interior Design'),
        ('mountain', 'Land Development'),
        ('building', 'Building'),
        ('tools', 'Tools/Equipment'),
        ('truck', 'Transportation'),
        ('briefcase', 'Consultation'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=50, choices=ICON_CHOICES, default='hammer')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        db_table = 'services'
        ordering = ['order']


class Testimonial(models.Model):
    """Client testimonials."""
    client_name = models.CharField(max_length=200)
    client_photo = models.URLField(blank=True, null=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=5.0)
    review = models.TextField()
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.client_name
    
    class Meta:
        db_table = 'testimonials'
        ordering = ['order']


class WhyChooseUs(models.Model):
    """Why Choose Us features."""
    ICON_CHOICES = [
        ('shield', 'Shield/Security'),
        ('star', 'Star/Quality'),
        ('clock', 'Clock/Time'),
        ('award', 'Award/Trophy'),
        ('heart', 'Heart/Trust'),
        ('users', 'Users/Team'),
        ('check', 'Check/Verified'),
        ('support', 'Support/Help'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=50, choices=ICON_CHOICES, default='shield')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        db_table = 'why_choose_us'
        ordering = ['order']
