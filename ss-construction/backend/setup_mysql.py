"""
MySQL Database Setup Script
Creates ss_construction database and ss_user with proper permissions
"""

import mysql.connector
from mysql.connector import Error
from getpass import getpass

def setup_mysql_database():
    """Create MySQL database and user for SS Construction."""
    
    try:
        # Connect as root
        app_password = getpass('Enter password to set for ss_user: ')
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password=input('Enter MySQL root password: ')
        )
        
        cursor = connection.cursor()
        
        print("\n🔧 Setting up MySQL database...\n")
        
        # 1. Create database
        print("1️⃣  Creating database 'ss_construction'...")
        cursor.execute("""
            CREATE DATABASE IF NOT EXISTS ss_construction 
            CHARACTER SET utf8mb4 
            COLLATE utf8mb4_unicode_ci
        """)
        print("   ✅ Database created successfully!")
        
        # 2. Create user
        print("\n2️⃣  Creating user 'ss_user'...")
        cursor.execute("""
            CREATE USER IF NOT EXISTS 'ss_user'@'localhost' 
            IDENTIFIED BY %s
        """, (app_password,))
        print("   ✅ User created successfully!")
        
        # 3. Grant privileges
        print("\n3️⃣  Granting privileges...")
        cursor.execute("""
            GRANT ALL PRIVILEGES ON ss_construction.* 
            TO 'ss_user'@'localhost'
        """)
        cursor.execute("FLUSH PRIVILEGES")
        print("   ✅ Privileges granted successfully!")
        
        # 4. Verify
        print("\n4️⃣  Verifying setup...\n")
        cursor.execute("SHOW DATABASES")
        databases = cursor.fetchall()
        print("   Databases:")
        for db in databases:
            if 'ss_construction' in db[0]:
                print(f"   ✅ {db[0]}")
            else:
                print(f"      {db[0]}")
        
        cursor.execute("SELECT User, Host FROM mysql.user WHERE User='ss_user'")
        user = cursor.fetchone()
        if user:
            print(f"\n   User: {user[0]}@{user[1]} ✅")
        
        cursor.close()
        connection.commit()
        connection.close()
        
        print("\n" + "="*50)
        print("✅ MySQL Setup Complete!")
        print("="*50)
        print("\nDatabase: ss_construction")
        print("User: ss_user")
        print("Password: the password you entered for ss_user")
        print("Host: localhost")
        print("\nYour .env file has been updated with these credentials.")
        print("\nNext step: Run 'python manage.py migrate'")
        print("="*50 + "\n")
        
        return True
        
    except Error as err:
        if err.errno == 1007:
            print("❌ Database already exists. Skipping creation.")
            print("   You can safely proceed with migrations.")
            return True
        elif err.errno == 1396:
            print("❌ User already exists. Skipping user creation.")
            print("   You can safely proceed with migrations.")
            return True
        else:
            print(f"❌ Error: {err}")
            print(f"   Error Code: {err.errno}")
            print(f"   SQL State: {err.sqlstate}")
            return False
    except Exception as e:
        print(f"❌ Connection error: {e}")
        print("\nPlease ensure:")
        print("  1. MySQL is installed and running")
        print("  2. Root user password is correct")
        print("  3. MySQL is listening on localhost:3306")
        return False

if __name__ == "__main__":
    success = setup_mysql_database()
    exit(0 if success else 1)
