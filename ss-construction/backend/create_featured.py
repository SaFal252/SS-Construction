"""
Script to create 10 featured Nepali modern houses
"""
import os
import django
import sys

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from properties.models import Property, PropertyImage
from django.contrib.auth import get_user_model

User = get_user_model()

# Get or create admin user
admin_user, _ = User.objects.get_or_create(
    email='admin@ssconstruction.com',
    defaults={
        'full_name': 'Admin User',
        'is_staff': True,
        'is_superuser': True,
    }
)
if not admin_user.has_usable_password():
    admin_user.set_password('admin123')
    admin_user.save()

# Nepali Modern House images from Unsplash (searching for Nepali/Kathmandu style)
nepali_houses = [
    {
        'title': 'Modern Nepali Villa in Lazimpat',
        'slug': 'modern-nepali-villa-lazimpat',
        'price': 85000000,
        'size': 4500,
        'size_unit': 'Sqft',
        'location': 'Lazimpat, Kathmandu',
        'bedrooms': 6,
        'bathrooms': 5,
        'description': 'Stunning modern Nepali villa with traditional Newari architecture elements. Features spacious rooms, modern amenities, and beautiful garden.',
        'image': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    },
    {
        'title': 'Contemporary House in Tokha',
        'slug': 'contemporary-house-tokha',
        'price': 45000000,
        'size': 3200,
        'size_unit': 'Sqft',
        'location': 'Tokha, Kathmandu',
        'bedrooms': 4,
        'bathrooms': 3,
        'description': 'Modern contemporary house with panoramic mountain views. Built with premium materials and modern construction techniques.',
        'image': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    },
    {
        'title': 'Luxury Home in Budhanilkantha',
        'slug': 'luxury-home-budhanilkantha',
        'price': 95000000,
        'size': 5500,
        'size_unit': 'Sqft',
        'location': 'Budhanilkantha, Kathmandu',
        'bedrooms': 7,
        'bathrooms': 6,
        'description': 'Ultra-luxury residence with swimming pool, home theater, and private garden. The epitome of modern living in Kathmandu.',
        'image': 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
    },
    {
        'title': 'Newari Style Modern House',
        'slug': 'newari-style-modern-house',
        'price': 55000000,
        'size': 3800,
        'size_unit': 'Sqft',
        'location': 'Patan, Lalitpur',
        'bedrooms': 5,
        'bathrooms': 4,
        'description': 'Beautiful blend of traditional Newari architecture with modern amenities. Features ornate windows and courtyard.',
        'image': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    },
    {
        'title': 'Hill View Residence',
        'slug': 'hill-view-residence',
        'price': 62000000,
        'size': 4200,
        'size_unit': 'Sqft',
        'location': 'Kapan, Kathmandu',
        'bedrooms': 5,
        'bathrooms': 4,
        'description': 'Stunning hill view residence with modern facilities. Perfect for families looking for peace and tranquility.',
        'image': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    },
    {
        'title': 'Modern Apartment in Thamel',
        'slug': 'modern-apartment-thamel',
        'price': 28000000,
        'size': 1800,
        'size_unit': 'Sqft',
        'location': 'Thamel, Kathmandu',
        'bedrooms': 3,
        'bathrooms': 2,
        'description': 'Modern apartment in the heart of Thamel. Walking distance to all amenities and tourist attractions.',
        'image': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    },
    {
        'title': 'Garden Villa in Kupondole',
        'slug': 'garden-villa-kupondole',
        'price': 48000000,
        'size': 3500,
        'size_unit': 'Sqft',
        'location': 'Kupondole, Lalitpur',
        'bedrooms': 4,
        'bathrooms': 3,
        'description': 'Beautiful garden villa with modern amenities. Features spacious parking and 24/7 security.',
        'image': 'https://images.unsplash.com/photo-1600573472591-ee6c563aaec3?w=800&q=80',
    },
    {
        'title': 'Penthouse in Sanepa',
        'slug': 'penthouse-sanepa',
        'price': 35000000,
        'size': 2400,
        'size_unit': 'Sqft',
        'location': 'Sanepa, Kathmandu',
        'bedrooms': 3,
        'bathrooms': 3,
        'description': 'Luxurious penthouse with rooftop terrace. Stunning views of the city and mountains.',
        'image': 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
    },
    {
        'title': 'Family Home in Baneshwor',
        'slug': 'family-home-baneshwor',
        'price': 32000000,
        'size': 2600,
        'size_unit': 'Sqft',
        'location': 'Baneshwor, Kathmandu',
        'bedrooms': 4,
        'bathrooms': 3,
        'description': 'Perfect family home in a quiet neighborhood. Near schools, hospitals, and shopping centers.',
        'image': 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    },
    {
        'title': 'Mountain View Cottage',
        'slug': 'mountain-view-cottage',
        'price': 42000000,
        'size': 2900,
        'size_unit': 'Sqft',
        'location': 'Godavari, Lalitpur',
        'bedrooms': 4,
        'bathrooms': 3,
        'description': 'Cozy mountain view cottage with modern facilities. Perfect weekend retreat or permanent residence.',
        'image': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    },
]

print("Creating featured Nepali modern houses...")

for house_data in nepali_houses:
    # Check if property already exists
    if Property.objects.filter(slug=house_data['slug']).exists():
        print(f"  - {house_data['title']} already exists, skipping...")
        continue
    
    # Create property
    property_obj = Property.objects.create(
        title=house_data['title'],
        slug=house_data['slug'],
        price=house_data['price'],
        size=house_data['size'],
        size_unit=house_data['size_unit'],
        location=house_data['location'],
        bedrooms=house_data['bedrooms'],
        bathrooms=house_data['bathrooms'],
        description=house_data['description'],
        house_type='Buy',
        status='Approved',
        is_featured=True,
        posted_by=admin_user,
    )
    
    # Create property image
    PropertyImage.objects.create(
        property=property_obj,
        image_url=house_data['image'],
        is_primary=True,
    )
    
    print(f"  - Created: {property_obj.title}")

# Mark existing properties as featured too
existing = Property.objects.filter(status='Approved', is_featured=False)[:2]
for p in existing:
    p.is_featured = True
    p.save()
    print(f"  - Marked as featured: {p.title}")

print(f"\nTotal featured properties: {Property.objects.filter(is_featured=True).count()}")
print("Done!")
