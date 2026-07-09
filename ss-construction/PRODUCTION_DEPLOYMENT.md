# Production Deployment Guide

## ✅ Completed Setup Items

### Phase 1: Security & Configuration
- ✅ Environment variables (.env file) configured
- ✅ DEBUG mode set to False in production
- ✅ ALLOWED_HOSTS restricted to specific domains
- ✅ CORS properly configured for production
- ✅ Security headers enabled (SSL, HSTS, CSP)
- ✅ Static files configured with WhiteNoise
- ✅ Media files serving configured

### Phase 2: User Authentication Enhancements
- ✅ Email verification system implemented
- ✅ Password reset functionality added
- ✅ Change password endpoint added
- ✅ Email templates created
- ✅ New API endpoints:
  - POST `/api/auth/verify-email/` - Verify email with token
  - POST `/api/auth/forgot-password/` - Request password reset
  - POST `/api/auth/reset-password/` - Reset password with token
  - POST `/api/auth/change-password/` - Change password (authenticated users)

---

## 📋 Next Steps for Production

### Phase 3: Database Migration to MySQL

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE ss_construction;
   CREATE USER 'ss_user'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON ss_construction.* TO 'ss_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Update .env file:**
   ```
   DB_ENGINE=django.db.backends.mysql
   DB_NAME=ss_construction
   DB_USER=ss_user
   DB_PASSWORD=secure_password
   DB_HOST=localhost
   DB_PORT=3306
   ```

3. **Run Migrations:**
   ```bash
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create Admin User:**
   ```bash
   python manage.py createsuperuser
   ```

### Phase 4: Production Deployment

#### Option A: Using Render or Railway (Recommended for Beginners)

1. Push code to GitHub
2. Create Render/Railway account
3. Connect repository
4. Set environment variables in deployment dashboard
5. Deploy automatically

#### Option B: Self-Hosted Deployment

1. **Install Production Web Server:**
   ```bash
   pip install gunicorn
   ```

2. **Configure Gunicorn (create `gunicorn_config.py`):**
   ```python
   import multiprocessing
   
   bind = "0.0.0.0:8000"
   workers = multiprocessing.cpu_count() * 2 + 1
   worker_class = "sync"
   max_requests = 1000
   max_requests_jitter = 100
   timeout = 30
   ```

3. **Use Nginx as Reverse Proxy:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
       
       location /static/ {
           alias /path/to/backend/staticfiles/;
       }
       
       location /media/ {
           alias /path/to/backend/media/;
       }
   }
   ```

4. **Setup SSL with Let's Encrypt:**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

5. **Run with Systemd Service:**
   Create `/etc/systemd/system/ss-construction.service`:
   ```ini
   [Unit]
   Description=SS Construction Backend
   After=network.target
   
   [Service]
   User=www-data
   WorkingDirectory=/path/to/backend
   ExecStart=/path/to/venv/bin/gunicorn -c gunicorn_config.py core.wsgi:application
   Restart=always
   
   [Install]
   WantedBy=multi-user.target
   ```

   Then:
   ```bash
   sudo systemctl enable ss-construction
   sudo systemctl start ss-construction
   ```

### Phase 5: Frontend Production Build

1. **Update .env for production:**
   ```
   VITE_API_URL=https://yourdomain.com/api
   VITE_SITE_URL=https://yourdomain.com
   ```

2. **Build:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy built files to:**
   - Vercel
   - Netlify
   - GitHub Pages
   - Or serve from same server with Nginx

### Phase 6: Monitoring & Maintenance

1. **Setup Logging:**
   - Configure Django logging to file
   - Monitor Gunicorn logs

2. **Database Backups:**
   ```bash
   # Daily MySQL backup
   mysqldump -u ss_user -p ss_construction > backup_$(date +%Y%m%d).sql
   ```

3. **Security Updates:**
   - Keep dependencies updated: `pip install --upgrade -r requirements.txt`
   - Monitor security advisories

4. **Performance:**
   - Enable caching (Redis/Memcached)
   - Use CDN for static files
   - Monitor response times

---

## 🔒 Security Checklist

- ✅ SECRET_KEY is strong and unique
- ✅ DEBUG = False
- ✅ ALLOWED_HOSTS restricted
- ✅ CORS properly configured
- ✅ Security headers enabled
- ✅ SSL/HTTPS configured
- ⏳ Update sensitive credentials in .env
- ⏳ Regular database backups
- ⏳ Dependency vulnerability scanning

---

## 📞 Support

For production issues:
1. Check Django logs
2. Check Gunicorn/web server logs
3. Check database connectivity
4. Verify environment variables
5. Check DNS configuration

---

## Environment Variables Template

```bash
# Django Settings
DEBUG=False
DJANGO_SECRET_KEY=your-very-long-random-secret-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DB_ENGINE=django.db.backends.mysql
DB_NAME=ss_construction
DB_USER=ss_user
DB_PASSWORD=your-secure-db-password
DB_HOST=your-db-server.com
DB_PORT=3306

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password
DEFAULT_FROM_EMAIL=your-email@gmail.com

# Frontend URLs
FRONTEND_URL=https://yourdomain.com
FRONTEND_PRODUCTION_URL=https://yourdomain.com

# Google OAuth (if using)
GOOGLE_OAUTH_CLIENT_ID=your-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret
```

---

Last Updated: May 26, 2024
