"""Email utilities for sending verification and password reset emails."""

import secrets
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .models import EmailVerificationToken, PasswordResetToken


def generate_email_verification_token(user):
    """Generate and save an email verification token."""
    token = secrets.token_urlsafe(32)
    expires_at = timezone.now() + timedelta(days=settings.EMAIL_VERIFICATION_TIMEOUT_DAYS)
    
    # Delete any existing token
    EmailVerificationToken.objects.filter(user=user).delete()
    
    verification_token = EmailVerificationToken.objects.create(
        user=user,
        token=token,
        expires_at=expires_at
    )
    return token


def send_email_verification(user, token):
    """Send email verification email to the user."""
    frontend_url = settings.FRONTEND_PRODUCTION_URL or settings.FRONTEND_URL
    verification_link = f"{frontend_url}/verify-email?token={token}&email={user.email}"
    
    context = {
        'user': user,
        'verification_link': verification_link,
        'timeout_days': settings.EMAIL_VERIFICATION_TIMEOUT_DAYS,
    }
    
    # Send HTML email
    html_message = render_to_string('emails/verify_email.html', context)
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject='Verify Your Email - SS Construction',
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send verification email: {str(e)}")
        return False


def verify_email_token(token):
    """Verify an email verification token and mark email as verified."""
    try:
        verification_token = EmailVerificationToken.objects.get(token=token, is_used=False)
        
        if not verification_token.is_valid():
            return False, "Token has expired."
        
        # Mark email as verified
        user = verification_token.user
        user.email_verified = True
        user.email_verified_at = timezone.now()
        user.is_active = True  # Activate user
        user.save()
        
        # Mark token as used
        verification_token.is_used = True
        verification_token.used_at = timezone.now()
        verification_token.save()
        
        return True, "Email verified successfully."
    except EmailVerificationToken.DoesNotExist:
        return False, "Invalid or expired token."


def generate_password_reset_token(user):
    """Generate and save a password reset token."""
    token = secrets.token_urlsafe(32)
    expires_at = timezone.now() + timedelta(hours=24)
    
    # Delete any existing token
    PasswordResetToken.objects.filter(user=user).delete()
    
    reset_token = PasswordResetToken.objects.create(
        user=user,
        token=token,
        expires_at=expires_at
    )
    return token


def send_password_reset_email(user, token):
    """Send password reset email to the user."""
    frontend_url = settings.FRONTEND_PRODUCTION_URL or settings.FRONTEND_URL
    reset_link = f"{frontend_url}/reset-password?token={token}&email={user.email}"
    
    context = {
        'user': user,
        'reset_link': reset_link,
    }
    
    # Send HTML email
    html_message = render_to_string('emails/reset_password.html', context)
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject='Reset Your Password - SS Construction',
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send password reset email: {str(e)}")
        return False


def verify_password_reset_token(token):
    """Verify a password reset token."""
    try:
        reset_token = PasswordResetToken.objects.get(token=token, is_used=False)
        
        if not reset_token.is_valid():
            return False, None, "Token has expired."
        
        return True, reset_token.user, "Token is valid."
    except PasswordResetToken.DoesNotExist:
        return False, None, "Invalid or expired token."
