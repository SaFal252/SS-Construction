## Real Estate Website - Setup & Installation Guide

### Quick Start

This is a Django + React-based real estate website with comprehensive property management, favorites system, and user dashboard.

### Backend Setup

#### 1. Python Environment Setup
```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

#### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 3. Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### 4. Create Admin User
```bash
python manage.py createsuperuser
# Or use the provided script
python create_admin_user.py
```

#### 5. Run Backend Server
```bash
python manage.py runserver
# Server runs on http://localhost:8000
```

### Frontend Setup

#### 1. Install Dependencies
```bash
cd frontend
npm install
```

#### 2. Set Environment Variables
Create `.env.local` file in frontend directory:
```
VITE_API_URL=http://localhost:8000/api
```

#### 3. Run Development Server
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

#### 4. Build for Production
```bash
npm run build
npm run preview
```

---

### New Features Added

#### 1. Favorites System ⭐
- Save favorite properties with heart icon
- Persistent storage (localStorage + backend DB)
- View all saved properties in one place
- Compare up to 3 properties side-by-side

#### 2. Advanced Search 🔍
- Filter by price range
- Filter by property type, location
- Filter by bedrooms, bathrooms
- Sort by newest, price, rating
- Full-text search

#### 3. Property Comparison 📊
- Compare selected properties
- Side-by-side feature comparison
- Add/remove from comparison

#### 4. Testimonials Section 📝
- Customer reviews carousel
- Auto-rotating testimonials
- Display key statistics
- Professional layout

#### 5. Backend Favorites API
- `/api/favorites/` - List, create favorites
- `/api/favorites/toggle/` - Toggle favorite status
- `/api/favorites/is-favorite/` - Check if favorited
- `/api/favorites/count/` - Get favorite count
- `/api/comparisons/` - Manage property comparisons

---

### API Endpoints

#### Authentication
- `POST /api/auth/login/` - Login user
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/logout/` - Logout user

#### Properties
- `GET /api/properties/properties/` - List all properties
- `GET /api/properties/properties/{id}/` - Get property details
- `POST /api/properties/properties/` - Create property (admin)
- `PUT /api/properties/properties/{id}/` - Update property (admin)

#### Favorites (NEW)
- `GET /api/favorites/` - Get user's favorites
- `POST /api/favorites/` - Add to favorites
- `POST /api/favorites/toggle/` - Toggle favorite
- `GET /api/favorites/is-favorite/?property_id=1` - Check if favorite
- `GET /api/favorites/count/` - Get count
- `DELETE /api/favorites/{id}/` - Remove from favorites

#### Property Comparisons (NEW)
- `GET /api/comparisons/` - Get user's comparisons
- `POST /api/comparisons/` - Create comparison
- `GET /api/comparisons/{id}/` - Get comparison details

---

### Technology Stack

**Backend:**
- Django 4.2+
- Django REST Framework
- Django JWT Authentication
- Cloudinary for media storage
- MySQL/SQLite Database

**Frontend:**
- React 18.2+
- Vite 5.0+
- TailwindCSS 3.4+
- React Router 6.22+
- Axios for API calls
- Framer Motion for animations

---

### Project Structure

```
ss-construction/
├── backend/
│   ├── accounts/          # User authentication
│   ├── properties/        # Property listings
│   ├── inquiries/         # Inquiry management
│   ├── site_settings/     # Settings management
│   ├── favorites/         # NEW: Favorites & comparisons
│   └── core/              # Django settings & URLs
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context API
│   │   ├── api/           # API utilities
│   │   └── App.jsx        # Main app
│   └── package.json
```

---

### Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User logs in with email and password
2. Server returns access and refresh tokens
3. Access token stored in localStorage
4. Refresh token used to get new access tokens
5. All API requests include Authorization header with Bearer token

---

### Database Models

#### New Models Added
- **Favorite** - Tracks user favorite properties
- **PropertyComparison** - Tracks property comparisons

#### Existing Models
- **CustomUser** - User authentication
- **Property** - Property listings
- **BuildProject** - Construction projects
- **Inquiry** - User inquiries
- **SellRequest** - Property sell requests

---

### Deployment

#### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy the dist folder
```

#### Backend Deployment (Heroku/Railway/Render)
```bash
# Set environment variables
# Push to platform
git push heroku main
```

---

### Troubleshooting

**CORS Errors:**
- Update `CORS_ALLOWED_ORIGINS` in Django settings
- Ensure frontend URL is in allowed origins

**Database Errors:**
- Run migrations: `python manage.py migrate`
- Check database connection settings

**API Connection Issues:**
- Verify backend is running on correct port
- Check VITE_API_URL in .env.local
- Check browser console for errors

---

### Performance Optimization

1. **Frontend:**
   - Lazy loading of images
   - Code splitting with React.lazy()
   - Caching with localStorage

2. **Backend:**
   - Database indexing on frequently queried fields
   - Pagination for large datasets
   - Query optimization with select_related/prefetch_related

---

### Security Notes

1. Change Django SECRET_KEY for production
2. Set DEBUG=False in production
3. Use environment variables for sensitive data
4. Enable HTTPS
5. Implement rate limiting
6. Regular security updates

---

### Contributing

To contribute to this project:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

### License

This project is proprietary and developed for SS Construction.

---

### Support

For issues or questions:
- Check GitHub issues
- Contact development team
- Email: info@ssconstruction.com

---

Last Updated: March 2026
