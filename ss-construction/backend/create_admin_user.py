# Management command to create an admin user
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_admin_user(email, password, first_name='Admin', last_name='User'):
    """Create or update an admin user."""
    username = email.split('@')[0]  # Create username from email
    
    try:
        user = User.objects.get(email=email)
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()
        print(f'Admin user {email} updated successfully!')
    except User.DoesNotExist:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_staff=True,
            is_superuser=True
        )
        print(f'Admin user {email} created successfully!')

if __name__ == '__main__':
    if len(sys.argv) > 2:
        email = sys.argv[1]
        password = sys.argv[2]
    else:
        email = input('Enter admin email: ')
        password = input('Enter admin password: ')
    
    create_admin_user(email, password)
