from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from properties.models import Property


@require_http_methods(["GET"])
def robots_txt(request):
    """Generate robots.txt file."""
    content = """User-agent: *
Allow: /

# Sitemap
Sitemap: https://www.ssconstruction.com/sitemap.xml

# Disallow admin
Disallow: /admin/
Disallow: /api/
"""
    return HttpResponse(content, content_type='text/plain')


@require_http_methods(["GET"])
def sitemap_xml(request):
    """Generate sitemap.xml with all property URLs."""
    from django.contrib.sites.models import Site
    from datetime import datetime
    
    # Get current site
    try:
        site = Site.objects.first()
        domain = site.domain if site else 'ssconstruction.com'
    except Exception:
        domain = 'ssconstruction.com'
    
    protocol = 'https' if not request.is_secure() else 'https'
    base_url = f"{protocol}://{domain}"
    
    # Static pages
    static_pages = [
        {'url': '/', 'priority': '1.0', 'changefreq': 'daily'},
        {'url': '/about/', 'priority': '0.8', 'changefreq': 'monthly'},
        {'url': '/contact/', 'priority': '0.8', 'changefreq': 'monthly'},
        {'url': '/buy/', 'priority': '0.9', 'changefreq': 'daily'},
        {'url': '/sell/', 'priority': '0.9', 'changefreq': 'daily'},
        {'url': '/construction/', 'priority': '0.8', 'changefreq': 'weekly'},
        {'url': '/portfolio/', 'priority': '0.8', 'changefreq': 'weekly'},
    ]
    
    # Get active properties
    properties = Property.objects.filter(status__in=['Available', 'Featured'])
    
    xml = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    # Add static pages
    for page in static_pages:
        xml.append('  <url>')
        xml.append(f'    <loc>{base_url}{page["url"]}</loc>')
        xml.append(f'    <changefreq>{page["changefreq"]}</changefreq>')
        xml.append(f'    <priority>{page["priority"]}</priority>')
        xml.append('  </url>')
    
    # Add property pages
    for prop in properties:
        xml.append('  <url>')
        xml.append(f'    <loc>{base_url}/property/{prop.slug}/</loc>')
        xml.append('    <changefreq>weekly</changefreq>')
        xml.append('    <priority>0.7</priority>')
        if prop.updated_at:
            xml.append(f'    <lastmod>{prop.updated_at.strftime("%Y-%m-%d")}</lastmod>')
        xml.append('  </url>')
    
    xml.append('</urlset>')
    
    return HttpResponse('\n'.join(xml), content_type='application/xml')
