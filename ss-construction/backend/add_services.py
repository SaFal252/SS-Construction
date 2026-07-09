import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from services.models import Service

# Sample services data
services_data = [
    {
        'name': 'Plumbing',
        'description': 'Professional plumbing services for installation, repair, and maintenance of water systems.',
        'features': 'Pipe Installation\nRepair & Maintenance\nWater System Design\nSewer Line Services\nEmergency Support',
        'price_range_min': 5000,
        'price_range_max': 500000,
    },
    {
        'name': 'Electrical',
        'description': 'Expert electrical services including wiring, installation, lighting design, and solar solutions.',
        'features': 'Wiring Installation\nPanel Installation\nLighting Design\nSolar Systems\nElectrical Repair',
        'price_range_min': 10000,
        'price_range_max': 1000000,
    },
    {
        'name': 'Carpentry',
        'description': 'Custom woodwork services including doors, fixtures, shelving, and built-in furniture.',
        'features': 'Custom Woodwork\nDoor Installation\nFixture Design\nBuilt-in Furniture\nWood Finishing',
        'price_range_min': 15000,
        'price_range_max': 800000,
    },
    {
        'name': 'Painting',
        'description': 'Interior and exterior painting with various finishes and specialty coatings.',
        'features': 'Interior Painting\nExterior Painting\nSpecialty Finishes\nColor Consultation\nSurface Preparation',
        'price_range_min': 8000,
        'price_range_max': 300000,
    },
    {
        'name': 'Masonry & Concrete',
        'description': 'Professional masonry and concrete work for walls, foundations, and decorative structures.',
        'features': 'Brickwork\nConcrete Work\nFoundations\nRetaining Walls\nDecorative Masonry',
        'price_range_min': 20000,
        'price_range_max': 2000000,
    },
    {
        'name': 'Tiling & Flooring',
        'description': 'Expert tiling and flooring installation for bathrooms, kitchens, and all living spaces.',
        'features': 'Ceramic Tiles\nStone Tiles\nWood Flooring\nLaminate\nGrouting & Sealing',
        'price_range_min': 12000,
        'price_range_max': 600000,
    },
]

for service_data in services_data:
    service, created = Service.objects.get_or_create(
        name=service_data['name'],
        defaults={
            'description': service_data['description'],
            'features': service_data['features'],
            'price_range_min': service_data['price_range_min'],
            'price_range_max': service_data['price_range_max'],
            'is_active': True,
        }
    )
    if created:
        print(f'✓ Created service: {service.name}')
    else:
        print(f'• Service already exists: {service.name}')

print('\n✅ All sample services added successfully!')
