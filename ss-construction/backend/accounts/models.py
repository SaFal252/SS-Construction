from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.utils import timezone


class CustomUser(AbstractUser):
    """Custom User model for SS Construction using email as login."""

    username_validator = UnicodeUsernameValidator()

    # Make username non-unique (users authenticate via email).
    username = models.CharField(
        max_length=150,
        unique=False,
        db_index=True,
        help_text=(
            '150 characters or fewer. Letters, digits and @/./+/-/_ only.'
        ),
        validators=[username_validator],
    )
    
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]
    
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20, blank=True, default='')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        return self.full_name
    
    def get_short_name(self):
        return self.full_name.split()[0] if self.full_name else self.email


class OTPVerification(models.Model):
    email = models.EmailField(unique=True)
    # Stores a hashed OTP value (never store plain OTP).
    otp = models.CharField(max_length=128)
    # Must update on every resend; do not use auto_now_add.
    created_at = models.DateTimeField(default=timezone.now)
    is_verified = models.BooleanField(default=False)

    class Meta:
        db_table = 'OTPVerification'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['created_at']),
            models.Index(fields=['is_verified']),
        ]

    def __str__(self):
        return f"OTPVerification(email={self.email}, verified={self.is_verified})"


class PendingSignup(models.Model):
    """Stores signup form data temporarily until OTP is verified."""

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=200)
    username = models.CharField(max_length=150, blank=True, default='')
    phone = models.CharField(max_length=20, blank=True, default='')
    # Store Django hashed password (never plaintext).
    password_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'PendingSignup'
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['updated_at']),
        ]

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        return super().save(*args, **kwargs)
