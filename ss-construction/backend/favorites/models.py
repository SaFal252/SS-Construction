from django.db import models
from django.contrib.auth import get_user_model
from properties.models import Property

User = get_user_model()


class Favorite(models.Model):
    """Model to track user favorite properties."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'favorites'
        unique_together = ('user', 'property')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.property.title}"


class PropertyComparison(models.Model):
    """Model to track user property comparisons."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comparisons')
    properties = models.ManyToManyField(Property, related_name='compared_by')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'property_comparisons'
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Comparison by {self.user.email}"
