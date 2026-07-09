-- MySQL setup script for SS Construction
-- Run this with: mysql -u root -p < setup_mysql.sql

-- Create database
CREATE DATABASE IF NOT EXISTS ss_construction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
-- Replace CHANGE_ME_STRONG_PASSWORD before running this script.
CREATE USER IF NOT EXISTS 'ss_user'@'localhost' IDENTIFIED BY 'CHANGE_ME_STRONG_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON ss_construction.* TO 'ss_user'@'localhost';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User='ss_user';
