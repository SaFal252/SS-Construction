from datetime import timedelta
import random
import logging

from rest_framework import status, generics, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password, check_password
from django.core.mail import send_mail
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import OTPVerification, PendingSignup
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    SendOTPSerializer,
    SignupSendOTPSerializer,
    VerifyOTPSerializer,
)

# Google OAuth imports
try:
    from google.auth.transport import requests as google_requests
    from google.oauth2 import id_token as google_id_token
    GOOGLE_AUTH_AVAILABLE = True
except ImportError:
    GOOGLE_AUTH_AVAILABLE = False

CustomUser = get_user_model()
logger = logging.getLogger(__name__)


def _generate_otp_code() -> str:
    return f"{random.randint(0, 999999):06d}"


def _username_from_email(email: str) -> str:
    return (email.split('@')[0] or 'user').replace('.', '_')[:150]


def _default_username(email: str) -> str:
    # Email is unique, so this will be unique enough for most uses.
    return _username_from_email(email)


def _get_error_message(exc) -> str:
    # Avoid leaking internal details.
    return 'Failed to send OTP. Please try again.'


def _user_payload(user) -> dict:
    if user.is_staff or user.is_superuser:
        role = 'admin'
    else:
        role = 'user'

    full_name = getattr(user, 'full_name', '') or ''
    parts = full_name.split() if full_name else []
    first_name = parts[0] if parts else ''
    last_name = ' '.join(parts[1:]) if len(parts) > 1 else ''

    return {
        'id': user.id,
        'first_name': first_name,
        'last_name': last_name,
        'full_name': full_name,
        'email': user.email,
        'phone_number': getattr(user, 'phone', '') or '',
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
        'role': role,
    }


class RegisterView(generics.CreateAPIView):
    """API endpoint for user registration."""
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User management (admin only)."""
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['email', 'first_name', 'last_name', 'phone']
    
    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [IsAdminUser()]
        if self.action in ['update', 'partial_update']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return CustomUser.objects.all()
        return CustomUser.objects.filter(id=self.request.user.id)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        password = request.data.get('password')
        user = serializer.save()
        user.set_password(password)
        user.save()
        
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user info."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """API endpoint for user login using email."""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        # Try to find user by email
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check password
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            # Determine role
            if user.is_staff or user.is_superuser:
                role = 'admin'
            else:
                role = 'user'
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'first_name': user.full_name.split()[0] if user.full_name else '',
                    'last_name': ' '.join(user.full_name.split()[1:]) if user.full_name and len(user.full_name.split()) > 1 else '',
                    'full_name': user.full_name,
                    'email': user.email,
                    'phone_number': user.phone,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'role': role,
                }
            })
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def token_refresh_view(request):
    """API endpoint to refresh access token."""
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            return Response({
                'access': str(token.access_token),
                'refresh': str(token),
            })
        return Response({'error': 'Refresh token required'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """API endpoint for user logout."""
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Logout successful'})
    except Exception:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """Get current user info with role."""
    user = request.user
    # Determine role
    if user.is_staff or user.is_superuser:
        role = 'admin'
    else:
        role = 'user'
    serializer = UserSerializer(user)
    data = serializer.data
    data['role'] = role
    data['is_staff'] = user.is_staff
    data['is_superuser'] = user.is_superuser
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    """Change user password."""
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')
    
    if not user.check_password(old_password):
        return Response(
            {'error': 'Current password is incorrect'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if new_password != confirm_password:
        return Response(
            {'error': 'New passwords do not match'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        validate_password(new_password, user)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user.set_password(new_password)
    user.save()
    
    return Response({'message': 'Password changed successfully'})


@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp_view(request):
    """Send a 6-digit OTP to an email address.

    Notes:
    - OTP is hashed in DB.
    - OTP expires exactly after 60 seconds based on created_at.
    - Uses update_or_create so the email has at most one active record.
    """
    # This endpoint supports the signup flow:
    # - client submits full signup form
    # - we validate and store it as PendingSignup
    # - we send OTP and store hashed OTP in OTPVerification
    is_signup_payload = 'password' in request.data or 'full_name' in request.data
    if is_signup_payload:
        serializer = SignupSendOTPSerializer(data=request.data)
    else:
        serializer = SendOTPSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.validated_data['email'].lower().strip()

    otp_code = _generate_otp_code()
    now = timezone.now()

    # If SMTP isn't configured, fail clearly (but don't expose secrets).
    # For console/locmem backends in dev, don't require SMTP credentials.
    if getattr(settings, 'EMAIL_BACKEND', '') == 'django.core.mail.backends.smtp.EmailBackend':
        if not getattr(settings, 'EMAIL_HOST_USER', '') or not getattr(settings, 'EMAIL_HOST_PASSWORD', ''):
            return Response(
                {
                    'error': 'Email service not configured. Set EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in your environment.'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    try:
        with transaction.atomic():
            # For signup flow, store pending user details (do NOT create user yet).
            if is_signup_payload:
                if CustomUser.objects.filter(email=email).exists():
                    return Response(
                        {'error': 'This email is already registered. Please log in instead.'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                pending_defaults = {
                    'full_name': serializer.validated_data['full_name'].strip(),
                    'username': (serializer.validated_data.get('username') or '').strip(),
                    'phone': (serializer.validated_data.get('phone') or '').strip(),
                    'password_hash': make_password(serializer.validated_data['password']),
                    'created_at': now,
                    'updated_at': now,
                }
                PendingSignup.objects.update_or_create(email=email, defaults=pending_defaults)

            OTPVerification.objects.update_or_create(
                email=email,
                defaults={
                    'otp': make_password(otp_code),
                    'created_at': now,
                    'is_verified': False,
                },
            )

            send_mail(
                subject='Your SS Construction OTP',
                message=(
                    f"Your verification code is: {otp_code}\n"
                    "This code expires in 1 minute."
                ),
                from_email=(getattr(settings, 'DEFAULT_FROM_EMAIL', '') or getattr(settings, 'EMAIL_HOST_USER', None)),
                recipient_list=[email],
                fail_silently=False,
            )

        return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)
    except Exception:
        logger.exception('Failed to send OTP email')
        # Never leak SMTP or internal errors to clients.
        return Response(
            {'error': _get_error_message(None)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp_view(request):
    """Verify an OTP.

    If there is a PendingSignup for this email, create the user only after OTP is valid.
    Otherwise, if a user exists for this email, treat it as OTP login.
    """
    serializer = VerifyOTPSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.validated_data['email'].lower().strip()
    otp_input = serializer.validated_data['otp']

    try:
        otp_record = OTPVerification.objects.get(email=email)
    except OTPVerification.DoesNotExist:
        return Response({'error': 'OTP not found. Please request a new OTP.'}, status=status.HTTP_400_BAD_REQUEST)

    if otp_record.is_verified:
        return Response({'error': 'OTP already used. Please request a new OTP.'}, status=status.HTTP_400_BAD_REQUEST)

    expires_at = otp_record.created_at + timedelta(minutes=1)
    if timezone.now() > expires_at:
        return Response({'error': 'OTP expired. Please request a new OTP.'}, status=status.HTTP_400_BAD_REQUEST)

    if not check_password(otp_input, otp_record.otp):
        return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        otp_record.is_verified = True
        otp_record.save(update_fields=['is_verified'])

        pending = PendingSignup.objects.filter(email=email).first()
        if pending is not None:
            if CustomUser.objects.filter(email=email).exists():
                # Shouldn't happen in normal flow; keep it safe.
                return Response(
                    {'error': 'This email is already registered. Please log in instead.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            username_value = pending.username.strip() or _default_username(email)
            user = CustomUser.objects.create(
                email=email,
                username=username_value,
                full_name=pending.full_name,
                phone=pending.phone,
                role='user',
                is_active=True,
                password=pending.password_hash,
            )
            pending.delete()
        else:
            # OTP login fallback (optional): if user exists, issue tokens.
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                return Response(
                    {'error': 'No pending signup found. Please sign up first.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

    refresh = RefreshToken.for_user(user)
    return Response(
        {
            'message': 'OTP verified successfully',
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': _user_payload(user),
        },
        status=status.HTTP_200_OK,
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def google_login_view(request):
    """Handle Google OAuth login/signup."""
    if not GOOGLE_AUTH_AVAILABLE:
        return Response(
            {'error': 'Google authentication is not configured'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    token = request.data.get('token')
    
    if not token:
        return Response(
            {'error': 'Token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Verify the Google token
        idinfo = google_id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            settings.GOOGLE_OAUTH_CLIENT_ID
        )
        
        email = idinfo.get('email')
        name = idinfo.get('name', '')
        picture = idinfo.get('picture', '')
        
        # Create or get user
        user, created = CustomUser.objects.get_or_create(
            email=email,
            defaults={
                'username': email.split('@')[0].replace('.', '_'),
                'full_name': name,
                'is_active': True,
            }
        )
        
        # Update user info if new
        if created:
            user.full_name = name
            user.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'success': True,
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'user': _user_payload(user)
        }, status=status.HTTP_200_OK)
        
    except ValueError as e:
        # Invalid token
        logger.warning(f"Google OAuth token verification failed: {str(e)}")
        return Response(
            {'error': 'Invalid or expired token'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:
        logger.error(f"Google login error: {str(e)}")
        return Response(
            {'error': 'Authentication failed'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email_view(request):
    """Verify email using token."""
    from .serializers import VerifyEmailSerializer
    from .email_utils import verify_email_token
    
    serializer = VerifyEmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    token = serializer.validated_data['token']
    
    is_valid, message = verify_email_token(token)
    if is_valid:
        return Response({
            'message': message,
            'success': True
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'error': message,
            'success': False
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password_view(request):
    """Request password reset."""
    from .serializers import ForgotPasswordSerializer
    from .email_utils import generate_password_reset_token, send_password_reset_email
    
    serializer = ForgotPasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.validated_data['email'].lower().strip()
    
    try:
        user = CustomUser.objects.get(email=email)
        token = generate_password_reset_token(user)
        send_password_reset_email(user, token)
        
        return Response({
            'message': 'Password reset link has been sent to your email.',
            'success': True
        }, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        # Don't reveal if email exists for security
        return Response({
            'message': 'If this email is registered, you will receive a password reset link.',
            'success': True
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Password reset request error: {str(e)}")
        return Response({
            'error': 'Failed to send password reset email. Please try again.',
            'success': False
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_view(request):
    """Reset password using token."""
    from .serializers import ResetPasswordSerializer
    from .email_utils import verify_password_reset_token
    
    serializer = ResetPasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    token = serializer.validated_data['token']
    password = serializer.validated_data['password']
    
    is_valid, user, message = verify_password_reset_token(token)
    if not is_valid:
        return Response({
            'error': message,
            'success': False
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user.set_password(password)
        user.save()
        
        # Mark token as used
        from .models import PasswordResetToken
        token_obj = PasswordResetToken.objects.get(token=token)
        token_obj.is_used = True
        token_obj.used_at = timezone.now()
        token_obj.save()
        
        return Response({
            'message': 'Password reset successfully.',
            'success': True
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Password reset error: {str(e)}")
        return Response({
            'error': 'Failed to reset password. Please try again.',
            'success': False
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    """Change password for authenticated user."""
    from .serializers import ChangePasswordSerializer
    
    serializer = ChangePasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    user = request.user
    old_password = serializer.validated_data['old_password']
    new_password = serializer.validated_data['new_password']
    
    # Verify old password
    if not user.check_password(old_password):
        return Response({
            'error': 'Old password is incorrect.',
            'success': False
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user.set_password(new_password)
        user.save()
        
        return Response({
            'message': 'Password changed successfully.',
            'success': True
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Change password error: {str(e)}")
        return Response({
            'error': 'Failed to change password. Please try again.',
            'success': False
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
