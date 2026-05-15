from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string


def send_inquiry_notification(inquiry):
    """Send email notification to admin when a new inquiry is submitted."""
    admin_email = settings.DEFAULT_FROM_EMAIL
    
    subject = f"New Inquiry - {inquiry.get_inquiry_type_display()} from {inquiry.name}"
    
    try:
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #B8860B; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background: #f9f9f9; }}
                .field {{ margin-bottom: 15px; }}
                .label {{ font-weight: bold; color: #B8860B; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Inquiry Received</h1>
                </div>
                <div class="content">
                    <div class="field">
                        <span class="label">Name:</span> {inquiry.name}
                    </div>
                    <div class="field">
                        <span class="label">Email:</span> {inquiry.email or 'Not provided'}
                    </div>
                    <div class="field">
                        <span class="label">Phone:</span> {inquiry.phone}
                    </div>
                    <div class="field">
                        <span class="label">Inquiry Type:</span> {inquiry.get_inquiry_type_display()}
                    </div>
                    {f'<div class="field"><span class="label">Property:</span> {inquiry.property.title}</div>' if (inquiry.property and hasattr(inquiry.property, 'title')) else ''}
                    <div class="field">
                        <span class="label">Message:</span>
                        <p>{inquiry.message}</p>
                    </div>
                    <div class="field">
                        <span class="label">Submitted:</span> {inquiry.created_at.strftime('%Y-%m-%d %H:%M:%S') if inquiry.created_at else 'Just now'}
                    </div>
                </div>
                <div class="footer">
                    <p>SS Construction - Building Your Dreams</p>
                    <p>Tokha, Tarkeshwor, Kathmandu, Nepal</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_message = f"""
        New Inquiry from {inquiry.name}
        
        Name: {inquiry.name}
        Email: {inquiry.email or 'Not provided'}
        Phone: {inquiry.phone}
        Type: {inquiry.get_inquiry_type_display()}
        {f'Property: {inquiry.property.title}' if (inquiry.property and hasattr(inquiry.property, 'title')) else ''}
        
        Message:
        {inquiry.message}
        
        Submitted: {inquiry.created_at}
        """

        send_mail(
            subject=subject,
            message=text_message,
            from_email=admin_email,
            recipient_list=[admin_email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Email send error: {e}")
        return False


def send_sell_request_notification(sell_request):
    """Send email notification to admin when a new sell request is submitted."""
    admin_email = settings.DEFAULT_FROM_EMAIL
    
    subject = f"New Sell Request from {sell_request.name}"
    
    try:
        price_display = f"Rs. {sell_request.asking_price:,.0f}" if sell_request.asking_price else "Negotiable / Consult SS Construction"
        
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #B8860B; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background: #f9f9f9; }}
                .field {{ margin-bottom: 15px; }}
                .label {{ font-weight: bold; color: #B8860B; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Sell Request</h1>
                </div>
                <div class="content">
                    <div class="field">
                        <span class="label">Name:</span> {sell_request.name}
                    </div>
                    <div class="field">
                        <span class="label">Email:</span> {sell_request.email or 'Not provided'}
                    </div>
                    <div class="field">
                        <span class="label">Phone:</span> {sell_request.phone}
                    </div>
                    <div class="field">
                        <span class="label">Location:</span> {sell_request.location}
                    </div>
                    <div class="field">
                        <span class="label">Property Type:</span> {sell_request.get_property_type_display()}
                    </div>
                    <div class="field">
                        <span class="label">Asking Price:</span> {price_display}
                    </div>
                    <div class="field">
                        <span class="label">Description:</span>
                        <p>{sell_request.description}</p>
                    </div>
                    <div class="field">
                        <span class="label">Submitted:</span> {sell_request.created_at.strftime('%Y-%m-%d %H:%M:%S') if sell_request.created_at else 'Just now'}
                    </div>
                </div>
                <div class="footer">
                    <p>SS Construction - Building Your Dreams</p>
                    <p>Tokha, Tarkeshwor, Kathmandu, Nepal</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_message = f"""
        New Sell Request from {sell_request.name}
        
        Name: {sell_request.name}
        Email: {sell_request.email or 'Not provided'}
        Phone: {sell_request.phone}
        Location: {sell_request.location}
        Property Type: {sell_request.get_property_type_display()}
        Asking Price: {price_display}
        
        Description:
        {sell_request.description}
        
        Submitted: {sell_request.created_at}
        """

        send_mail(
            subject=subject,
            message=text_message,
            from_email=admin_email,
            recipient_list=[admin_email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Email send error: {e}")
        return False
