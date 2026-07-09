"""
URL configuration for SS Construction project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import settings_views, seo_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/properties/', include('properties.urls')),
    path('api/inquiries/', include('inquiries.urls')),
    path('api/site-settings/', include('site_settings.urls')),
    path('api/services/', include('services.urls')),
    path('api/crm/', include('crm.urls')),
    path('api/', include('favorites.urls')),
    path('api/core/settings/', settings_views.get_settings, name='get_settings'),
    path('api/core/settings/', settings_views.update_settings, name='update_settings'),
    
    # SEO
    path('robots.txt', seo_views.robots_txt, name='robots_txt'),
    path('sitemap.xml', seo_views.sitemap_xml, name='sitemap_xml'),
]

# Serve media files in development and production
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    # In production, media files are served by WhiteNoise middleware
    # Configure your web server (Nginx/Apache) to serve media files directly for best performance
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
