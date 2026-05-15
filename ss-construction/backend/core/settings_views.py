from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.conf import settings

# In-memory storage for settings (you can also use a database model)
_site_settings = {
    'site_name': 'SS Construction',
    'site_email': 'info@ssconstruction.com',
    'site_phone': '+977 9810163311',
    'site_address': 'Tokha, Tarkeshwor, Kathmandu, Nepal',
    'about_text': '',
    'facebook_url': '',
    'instagram_url': '',
    'linkedin_url': '',
    'hero_title': 'Building Your Dreams',
    'hero_subtitle': 'Quality construction and real estate services in Nepal'
}


@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_settings(request):
    """Get site settings."""
    return Response(_site_settings)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_settings(request):
    """Update site settings."""
    global _site_settings
    _site_settings.update(request.data)
    return Response(_site_settings)
