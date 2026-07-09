"""
MySQL User Setup Script
Creates a proper MySQL user for SS Construction
"""

import mysql.connector
from mysql.connector import Error
from getpass import getpass

def create_mysql_user():
    """Create MySQL user and database."""
    
    try:
        # Connect as root
        root_password = input('Enter MySQL root password: ')
        app_password = getpass('Enter password to set for ss_user: ')
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password=root_password
        )
        
        cursor = connection.cursor()
        
        print("\n🔧 Setting up MySQL...\n")
        
        # 1. Create database
        print("1️⃣  Creating database 'ss_construction'...")
        cursor.execute("""
            DROP DATABASE IF EXISTS ss_construction
        """)
        cursor.execute("""
            CREATE DATABASE ss_construction 
            CHARACTER SET utf8mb4 
            COLLATE utf8mb4_unicode_ci
        """)
        print("   ✅ Database created!")
        
        # 2. Create user with underscore (proper MySQL username)
        print("\n2️⃣  Creating user 'ss_user'...")
        cursor.execute("""
            DROP USER IF EXISTS 'ss_user'@'localhost'
        """)
        cursor.execute("""
            CREATE USER 'ss_user'@'localhost' 
            IDENTIFIED BY %s
        """, (app_password,))
        print("   ✅ User created!")
        
        # 3. Grant privileges
        print("\n3️⃣  Granting privileges...")
        cursor.execute("""
            GRANT ALL PRIVILEGES ON ss_construction.* 
            TO 'ss_user'@'localhost'
        """)
        cursor.execute("FLUSH PRIVILEGES")
        print("   ✅ Privileges granted!")
        
        cursor.close()
        connection.commit()
        connection.close()
        
        print("\n" + "="*60)
        print("✅ MySQL Setup Complete!")
        print("="*60)
        print("\n📋 Database Credentials:")
        print("  Database: ss_construction")
        print("  Username: ss_user")
        print("  Password: the password you entered for ss_user")
        print("  Host: localhost")
        print("  Port: 3306")
        print("\n✨ Next: Run 'python manage.py migrate'")
        print("="*60 + "\n")
        
        return True
        
    except Error as err:
        print(f"❌ MySQL Error: {err}")
        print(f"   Error Code: {err.errno}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = create_mysql_user()
    exit(0 if success else 1)
