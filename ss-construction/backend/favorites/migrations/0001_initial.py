# Generated migration for Favorites app

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('properties', '0011_property_face_direction_property_floors_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Favorite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorited_by', to='properties.property')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorites', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'favorites',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='PropertyComparison',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('properties', models.ManyToManyField(related_name='compared_by', to='properties.Property')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comparisons', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'property_comparisons',
                'ordering': ['-updated_at'],
            },
        ),
        migrations.AddConstraint(
            model_name='favorite',
            constraint=models.UniqueConstraint(fields=('user', 'property'), name='unique_user_property_favorite'),
        ),
    ]
