#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from properties.models import Property, PropertyImage

# Get the properties
properties = Property.objects.all()
print(f"Found {properties.count()} properties")

# Media URL base
media_base = "http://localhost:8000/media/property_images/"

# Image files available
images = [
    "70b77362b35b43f0a95cf019b0eb7c05.png",
    "394225c9ed314d488fc165c1ca5aa8e0.png"
]

# Assign images to properties
for i, prop in enumerate(properties):
    # Delete existing images for this property
    PropertyImage.objects.filter(property=prop).delete()
    
    # Add the first image as primary
    img_url = media_base + images[0] if i % 2 == 0 else media_base + images[1]
    PropertyImage.objects.create(
        property=prop,
        image_url=img_url,
        is_primary=True
    )
    print(f"Added primary image to: {prop.title}")
    
    # Add a second image (non-primary) if available
    if len(images) > 1:
        img_url2 = media_base + images[1] if i % 2 == 0 else media_base + images[0]
        PropertyImage.objects.create(
            property=prop,
            image_url=img_url2,
            is_primary=False
        )
        print(f"Added secondary image to: {prop.title}")

print("\nDone adding images to properties!")
