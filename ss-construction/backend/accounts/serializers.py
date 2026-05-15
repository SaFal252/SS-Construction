from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError

CustomUser = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for CustomUser model."""
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name', 'first_name', 'last_name', 'role', 'is_active', 'created_at', 'phone', 'is_staff']
        read_only_fields = ['id', 'is_active', 'created_at']
    
    def get_first_name(self, obj):
        return obj.full_name.split()[0] if obj.full_name else ''
    
    def get_last_name(self, obj):
        parts = obj.full_name.split()
        return ' '.join(parts[1:]) if len(parts) > 1 else ''


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password', 'confirm_password', 'full_name', 'phone']
        extra_kwargs = {
            # Keep model-level uniqueness validation (do not override the field itself).
            'username': {'required': False, 'allow_blank': True},
        }

    def _default_username(self, email: str) -> str:
        return (email.split('@')[0] or 'user').replace('.', '_')[:150]

    def validate(self, attrs):
        confirm_password = attrs.get('confirm_password')
        if confirm_password is None:
            raise serializers.ValidationError({"confirm_password": "This field is required."})

        if attrs.get('password') != confirm_password:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        email = (validated_data.get('email') or '').lower().strip()
        validated_data['email'] = email

        username = (validated_data.get('username') or '').strip()
        if not username:
            validated_data['username'] = self._default_username(email)

        try:
            user = CustomUser.objects.create_user(**validated_data)
        except IntegrityError:
            # Defensive: convert DB constraint errors into clean 400s.
            raise serializers.ValidationError({"email": "This email is already registered."})

        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()


class SignupSendOTPSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    username = serializers.CharField(required=False, allow_blank=True, max_length=150)
    phone = serializers.CharField(required=False, allow_blank=True, max_length=20)
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.RegexField(regex=r'^\d{6}$', max_length=6, min_length=6)
