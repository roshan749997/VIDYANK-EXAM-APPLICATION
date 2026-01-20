# Deployment Guide - Vidyank Exam System

This guide covers deploying the Vidyank Online Exam Conduct System to production.

---

## 🌐 Deployment Options

### Option 1: Backend Deployment (Recommended)

#### Deploy to Railway.app (Free Tier Available)

1. **Create Railway Account**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Navigate to backend
   cd backend
   
   # Initialize Railway project
   railway init
   
   # Deploy
   railway up
   ```

3. **Set Environment Variables**
   - Go to Railway dashboard
   - Select your project
   - Add variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_atlas_uri
     JWT_SECRET=your_secret_key
     NODE_ENV=production
     ```

4. **Get Deployment URL**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Update frontend API configuration

#### Alternative: Deploy to Render.com

1. **Create Render Account**
   - Visit [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Connect your GitHub repository
   - Select `backend` folder
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**
   - Add same variables as Railway

---

### Option 2: Frontend Deployment

#### Deploy Web Version to Vercel

1. **Prepare for Deployment**
   ```bash
   cd frontend
   
   # Update API URL in src/services/api.ts
   # Change BASE_URL to your deployed backend URL
   ```

2. **Build for Web**
   ```bash
   npm run vercel-build
   ```

3. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login
   vercel login
   
   # Deploy
   vercel
   ```

4. **Configure Vercel**
   - Framework Preset: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: `web-build`

#### Build Android APK

1. **Configure for Production**
   ```bash
   cd frontend
   
   # Update app.json
   # Set version, name, etc.
   ```

2. **Build APK**
   ```bash
   # Install EAS CLI
   npm install -g eas-cli
   
   # Login to Expo
   eas login
   
   # Configure build
   eas build:configure
   
   # Build for Android
   eas build --platform android --profile preview
   ```

3. **Download APK**
   - Check build status on Expo dashboard
   - Download APK when ready
   - Distribute to users

---

## 🗄️ MongoDB Atlas Setup (Production)

1. **Create MongoDB Atlas Account**
   - Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to your users
   - Create cluster

3. **Configure Network Access**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (Allow from anywhere)
   - ⚠️ For production, restrict to specific IPs

4. **Create Database User**
   - Go to Database Access
   - Add New Database User
   - Username: `vidyank_admin`
   - Password: Generate secure password
   - Role: Atlas Admin

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Use this in `MONGODB_URI` environment variable

---

## 🔒 Production Security Checklist

### Backend Security

- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable CORS only for your frontend domain
- [ ] Set up rate limiting
- [ ] Enable HTTPS (automatic on Railway/Render)
- [ ] Validate all user inputs
- [ ] Implement request logging
- [ ] Set up error monitoring (Sentry)

### Frontend Security

- [ ] Remove console.logs
- [ ] Obfuscate code (automatic in production build)
- [ ] Use HTTPS for API calls
- [ ] Implement proper error handling
- [ ] Secure AsyncStorage data

### Database Security

- [ ] Use strong passwords
- [ ] Enable MongoDB authentication
- [ ] Restrict network access
- [ ] Regular backups
- [ ] Monitor database logs

---

## 📊 Environment Variables Reference

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vidyank

# Authentication
JWT_SECRET=your_very_long_and_secure_random_string_here

# Optional
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (update in code)
```typescript
// src/services/api.ts
const BASE_URL = 'https://your-backend-url.railway.app/api';
```

---

## 🚀 Deployment Workflow

### Initial Deployment

1. **Setup MongoDB Atlas** (Production Database)
2. **Deploy Backend** (Railway/Render)
3. **Update Frontend API URL**
4. **Deploy Frontend** (Vercel for web, EAS for mobile)
5. **Run Database Seeders** (Admin user, sample exams)
6. **Test Complete Flow**

### Continuous Deployment

```bash
# Backend updates
cd backend
git add .
git commit -m "Update: description"
git push origin main
# Railway/Render auto-deploys

# Frontend updates
cd frontend
git add .
git commit -m "Update: description"
git push origin main
# Vercel auto-deploys (if configured)
```

---

## 🧪 Testing Production Deployment

### Backend Health Check
```bash
curl https://your-backend-url.railway.app/
# Should return: "API is running..."
```

### Test Admin Login
1. Navigate to your frontend URL
2. Click "Admin" button
3. Login with: `admin@vidyank.com` / `Admin@123`
4. Verify dashboard loads

### Test Student Flow
1. Register new student account
2. Browse available exams
3. Start an exam
4. Submit and verify results saved

---

## 📱 Mobile App Distribution

### Android (APK)

1. **Build APK** (as shown above)
2. **Distribution Options:**
   - Direct download link
   - Google Play Store (requires developer account)
   - Firebase App Distribution
   - TestFlight (for testing)

### iOS (IPA)

1. **Requirements:**
   - Apple Developer Account ($99/year)
   - Mac computer for building

2. **Build IPA:**
   ```bash
   eas build --platform ios --profile production
   ```

3. **Distribute:**
   - TestFlight (beta testing)
   - App Store (production)

---

## 🔧 Post-Deployment Tasks

### 1. Database Seeding
```bash
# SSH into your backend server or run locally pointing to production DB

# Seed admin user
node seedAdmin.js

# Seed sample exams (optional)
node seedExams.js
```

### 2. Monitor Application
- Set up error tracking (Sentry, LogRocket)
- Monitor server logs
- Track API response times
- Monitor database performance

### 3. Backup Strategy
- Enable MongoDB Atlas automated backups
- Export exam data regularly
- Keep backup of question banks
- Document recovery procedures

---

## 🆘 Troubleshooting Production Issues

### Backend Not Responding
1. Check Railway/Render logs
2. Verify environment variables
3. Check MongoDB connection
4. Restart service

### Frontend Can't Connect
1. Verify API URL in code
2. Check CORS settings
3. Ensure HTTPS is used
4. Check network tab in browser

### Database Connection Failed
1. Verify MongoDB Atlas is running
2. Check connection string
3. Verify IP whitelist
4. Check database user permissions

---

## 📈 Scaling Considerations

### When to Scale

- **Backend:** > 100 concurrent users
- **Database:** > 10GB data or slow queries
- **Frontend:** High traffic, slow load times

### Scaling Options

1. **Backend:**
   - Upgrade Railway/Render plan
   - Use load balancer
   - Implement caching (Redis)

2. **Database:**
   - Upgrade MongoDB Atlas tier
   - Add read replicas
   - Implement database indexing

3. **Frontend:**
   - Use CDN (Cloudflare)
   - Optimize bundle size
   - Implement lazy loading

---

## 💰 Cost Estimation

### Free Tier (Suitable for Testing)
- MongoDB Atlas: Free (M0 - 512MB)
- Railway: Free tier available
- Vercel: Free for hobby projects
- **Total: $0/month**

### Production (Small Scale)
- MongoDB Atlas: $9/month (M10 - 2GB)
- Railway: $5/month (Hobby plan)
- Vercel: Free (or $20/month Pro)
- **Total: ~$14-34/month**

### Production (Medium Scale)
- MongoDB Atlas: $57/month (M20 - 10GB)
- Railway: $20/month (Pro plan)
- Vercel: $20/month (Pro)
- **Total: ~$97/month**

---

## 📞 Support Resources

- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **Render Docs:** [render.com/docs](https://render.com/docs)
- **MongoDB Atlas:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Expo EAS:** [docs.expo.dev/eas](https://docs.expo.dev/eas)
- **Vercel:** [vercel.com/docs](https://vercel.com/docs)

---

**Last Updated:** January 2026  
**Version:** 1.0.0
