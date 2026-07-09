from django.db import migrations


def create_sample_services(apps, schema_editor):
    Service = apps.get_model('services', 'Service')
    if Service.objects.exists():
        return

    samples = [
        {
            'name': 'Plumbing & Drainage',
            'description': 'Comprehensive plumbing services including installation, repair, and maintenance of pipes, drains, and fixtures.',
            'features': 'Leak repair\nPipe installation\nDrain cleaning\nBathroom plumbing',
            'price_range_min': None,
            'price_range_max': None,
            'is_active': True,
        },
        {
            'name': 'Electrical & Wiring',
            'description': 'Licensed electricians for rewiring, lighting, power upgrades and electrical safety inspections.',
            'features': 'Wiring\nLighting installation\nPanel upgrades\nSafety inspections',
            'price_range_min': None,
            'price_range_max': None,
            'is_active': True,
        },
        {
            'name': 'Carpentry & Woodwork',
            'description': 'Custom carpentry solutions including cabinets, doors, frames and fine wood finishing.',
            'features': 'Custom cabinets\nDoors & frames\nBuilt-ins\nFinishing',
            'price_range_min': None,
            'price_range_max': None,
            'is_active': True,
        },
        {
            'name': 'Painting & Finishing',
            'description': 'Interior and exterior painting services, surface preparation and protective coatings.',
            'features': 'Surface prep\nInterior painting\nExterior painting\nProtective coatings',
            'price_range_min': None,
            'price_range_max': None,
            'is_active': True,
        },
    ]

    for s in samples:
        Service.objects.create(
            name=s['name'],
            description=s['description'],
            features=s['features'],
            price_range_min=s['price_range_min'],
            price_range_max=s['price_range_max'],
            is_active=s['is_active']
        )


def remove_sample_services(apps, schema_editor):
    Service = apps.get_model('services', 'Service')
    names = ['Plumbing & Drainage', 'Electrical & Wiring', 'Carpentry & Woodwork', 'Painting & Finishing']
    Service.objects.filter(name__in=names).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_sample_services, remove_sample_services),
    ]
