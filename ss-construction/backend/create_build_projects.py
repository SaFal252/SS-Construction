#!/usr/bin/env python
"""Script to create sample build projects."""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
django.setup()

from properties.models import BuildProject

# Sample build projects
build_projects = [
    {
        'title': 'Custom Home Build - Tokha',
        'location': 'Tokha, Kathmandu',
        'plot_size': '5 Aana',
        'estimated_budget': 25000000,
        'build_type': 'Residential',
        'status': 'Ready to Build',
        'floors': 3,
        'parking_spaces': 2,
        'design_style': 'Modern',
        'description': 'Build your dream home from scratch in the prime location of Tokha. This project offers a custom home construction service where we handle everything from design to completion.',
        'is_featured': True,
    },
    {
        'title': 'Luxury Villa Construction',
        'location': 'Lazimpat, Kathmandu',
        'plot_size': '10 Aana',
        'estimated_budget': 85000000,
        'build_type': 'Residential',
        'status': 'In Progress',
        'floors': 4,
        'parking_spaces': 4,
        'design_style': 'Contemporary',
        'description': 'Premium villa construction with modern amenities, swimming pool, and landscaped gardens.',
        'is_featured': True,
    },
    {
        'title': 'Commercial Complex - Thamel',
        'location': 'Thamel, Kathmandu',
        'plot_size': '3 Ropani',
        'estimated_budget': 150000000,
        'build_type': 'Commercial',
        'status': 'Planning',
        'floors': 8,
        'parking_spaces': 50,
        'design_style': 'Modern',
        'description': 'State-of-the-art commercial complex in the heart of Thamel with retail spaces, offices, and basement parking.',
        'is_featured': True,
    },
    {
        'title': 'Townhouse Development',
        'location': 'Tokha-2, Kathmandu',
        'plot_size': '8 Aana',
        'estimated_budget': 45000000,
        'build_type': 'Mixed',
        'status': 'Ready to Build',
        'floors': 3,
        'parking_spaces': 2,
        'design_style': 'Minimalist',
        'description': 'Modern townhouse with 4 bedrooms, servant quarters, and rooftop terrace.',
        'is_featured': False,
    },
    {
        'title': 'Renovation & Extension Project',
        'location': 'Budhanilkantha, Kathmandu',
        'plot_size': '4 Aana',
        'estimated_budget': 15000000,
        'build_type': 'Residential',
        'status': 'In Progress',
        'floors': 2,
        'parking_spaces': 1,
        'design_style': 'Traditional',
        'description': 'Complete renovation and extension of existing house with modern amenities while preserving traditional elements.',
        'is_featured': False,
    },
    {
        'title': 'Office Building - Jawalakhel',
        'location': 'Jawalakhel, Lalitpur',
        'plot_size': '5 Ropani',
        'estimated_budget': 120000000,
        'build_type': 'Commercial',
        'status': 'Planning',
        'floors': 6,
        'parking_spaces': 30,
        'design_style': 'Contemporary',
        'description': 'Modern office building with coworking spaces, meeting rooms, and ground floor retail.',
        'is_featured': True,
    },
    {
        'title': 'Land + Build Package',
        'location': 'Chandragiri, Kathmandu',
        'plot_size': '10 Ropani',
        'estimated_budget': 95000000,
        'build_type': 'Residential',
        'status': 'Ready to Build',
        'floors': 2,
        'parking_spaces': 3,
        'design_style': 'Modern',
        'description': 'Buy land and let us build your dream home. Complete package including land purchase and construction.',
        'is_featured': True,
    },
    {
        'title': 'Mixed-Use Development',
        'location': 'Koteshwor, Kathmandu',
        'plot_size': '8 Ropani',
        'estimated_budget': 200000000,
        'build_type': 'Mixed',
        'status': 'Planning',
        'floors': 10,
        'parking_spaces': 60,
        'design_style': 'Modern',
        'description': 'Mixed-use development with apartments, offices, and retail spaces all in one complex.',
        'is_featured': False,
    },
]

def create_build_projects():
    """Create sample build projects."""
    created_count = 0
    for project_data in build_projects:
        # Check if project already exists
        if not BuildProject.objects.filter(title=project_data['title']).exists():
            BuildProject.objects.create(**project_data)
            created_count += 1
            print(f"Created: {project_data['title']}")
        else:
            print(f"Already exists: {project_data['title']}")
    
    print(f"\nTotal created: {created_count}")
    print(f"Total projects in database: {BuildProject.objects.count()}")

if __name__ == '__main__':
    create_build_projects()
