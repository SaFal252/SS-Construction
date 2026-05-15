#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from properties.models import Property
from django.contrib.auth import get_user_model

User = get_user_model()
admin = User.objects.filter(is_superuser=True).first()

if admin:
    # Delete old properties first
    Property.objects.all().delete()
    print("Deleted old properties")
    
    # Create new properties with Approved status (using correct field names)
    properties = [
        {
            'title': 'Beautiful House in Tokha',
            'price': 45000000,
            'size': 5,
            'size_unit': 'Aana',
            'location': 'Tokha, Kathmandu',
            'bedrooms': 4,
            'bathrooms': 3,
            'description': 'A beautiful house with modern amenities in Tokha area. Features spacious rooms, modern kitchen, and beautiful garden.',
            'house_type': 'Buy',
            'status': 'Approved',
        },
        {
            'title': 'Luxury Villa in Lazimpat',
            'price': 85000000,
            'size': 8,
            'size_unit': 'Aana',
            'location': 'Lazimpat, Kathmandu',
            'bedrooms': 6,
            'bathrooms': 5,
            'description': 'Luxury villa with swimming pool and garden. This exclusive property offers premium living with state-of-the-art facilities.',
            'house_type': 'Buy',
            'status': 'Approved',
        },
        {
            'title': 'Modern Apartment in Thamel',
            'price': 25000000,
            'size': 1800,
            'size_unit': 'Sqft',
            'location': 'Thamel, Kathmandu',
            'bedrooms': 3,
            'bathrooms': 2,
            'description': 'Modern apartment in the heart of Thamel. Perfect for those who want to live in the vibrant city center.',
            'house_type': 'Buy',
            'status': 'Approved',
        },
    ]
    
    for prop_data in properties:
        prop = Property.objects.create(**prop_data, posted_by=admin)
        print(f'Created: {prop.title} - Status: {prop.status}')
    
    print("\n3 properties created with Approved status!")
else:
    print("No admin user found!")
