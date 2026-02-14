# 🚀 Deployment Guide

This guide will help you deploy the Inventory Management System with frontend on Netlify and backend on Render.

## 📁 Project Structure

```
deployment/
├── frontend/          # Vue.js frontend for Netlify deployment
└── backend/           # JSON Server backend for Render deployment
```

## 🔧 Backend Deployment (Render)

### 1. Prepare Backend Files
The backend folder contains:
- `db.json` - Your database file
- `server.js` - Express server with CORS support
- `package.json` - Dependencies and scripts

### 2. Deploy to Render

1. **Create a new Web Service on Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository or upload the backend folder

2. **Configure the Service**
   - **Name**: `inventory-api` (or your preferred name)
   - **Root Directory**: `deployment/backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

3. **Environment Variables** (if needed)
   - Render automatically sets the `PORT` environment variable

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your API will be available at: `https://your-service-name.onrender.com`

### 3. Test the Backend
Once deployed, test these endpoints:
- `GET https://your-service-name.onrender.com/health`
- `GET https://your-service-name.onrender.com/purchases`
- `GET https://your-service-name.onrender.com/sales`

## 🎨 Frontend Deployment (Netlify)

### 1. Prepare Frontend Files
The frontend folder contains:
- Complete Vue.js application
- Environment configuration for production
- Netlify deployment settings

### 2. Configure Environment

1. **Update API URL**
   - Edit `deployment/frontend/.env.production`
   - Replace `https://your-backend-name.onrender.com` with your actual Render URL

2. **Local Testing**
   - Copy `.env.example` to `.env.local`
   - Update with your backend URL for local testing

### 3. Deploy to Netlify

#### Option A: Drag & Drop (Easiest)
1. **Build the frontend locally**:
   ```bash
   cd deployment/frontend
   npm install
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder to the deployment area

#### Option B: Git Integration (Recommended)
1. **Push to GitHub**:
   - Create a new repository or use existing one
   - Push the `deployment/frontend` folder

2. **Connect Netlify**:
   - Go to Netlify dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Set build settings:
     - **Base directory**: `deployment/frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`

### 4. Configure Netlify Settings
The `netlify.toml` file handles most configuration automatically:
- Single Page Application routing
- Build settings
- Environment variables

### 5. Environment Variables in Netlify
If you need to set environment variables:
1. Go to Site settings → Environment variables
2. Add `VITE_API_URL` with your Render backend URL

## 🔗 Connecting Frontend and Backend

### 1. Update Frontend API URL
Before deploying, make sure the frontend knows where to find the backend:

```bash
# In deployment/frontend/.env.production
VITE_API_URL=https://your-actual-render-url.onrender.com
```

### 2. CORS Configuration
The backend server.js already includes CORS configuration to allow requests from your Netlify frontend.

### 3. Testing the Connection
After deployment:
1. Visit your Netlify frontend URL
2. Try creating/viewing purchases and sales
3. Check browser console for any API errors

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure the backend `server.js` has CORS middleware
   - Check that the frontend URL is allowed

2. **API Connection Issues**
   - Verify the `VITE_API_URL` is correct
   - Check that the backend is deployed and running
   - Test the backend endpoints directly

3. **Build Failures**
   - Check that all dependencies are installed
   - Verify the build command in Netlify settings
   - Check build logs for specific errors

4. **Routing Issues**
   - Ensure `netlify.toml` is in the frontend root
   - Check that SPA routing is configured correctly

### Debugging Steps:

1. **Backend Health Check**:
   ```bash
   curl https://your-backend.onrender.com/health
   ```

2. **Frontend Environment**:
   - Check Netlify deploy logs
   - Verify environment variables are set

3. **Network Tab**:
   - Use browser dev tools to check API calls
   - Look for failed requests or CORS errors

## 📋 Deployment Checklist

### Backend (Render):
- [ ] Push backend code to GitHub
- [ ] Create Render web service
- [ ] Configure build and start commands
- [ ] Test API endpoints
- [ ] Note the deployed URL

### Frontend (Netlify):
- [ ] Update `.env.production` with backend URL
- [ ] Push frontend code to GitHub
- [ ] Connect Netlify to repository
- [ ] Configure build settings
- [ ] Deploy and test functionality
- [ ] Verify all features work correctly

## 🎉 Post-Deployment

Once both services are deployed:

1. **Test All Features**:
   - Create purchases and sales
   - View stock management
   - Check detail pages
   - Verify all CRUD operations

2. **Monitor Performance**:
   - Check Netlify analytics
   - Monitor Render service metrics
   - Set up error tracking if needed

3. **Backup Strategy**:
   - Regularly backup your `db.json`
   - Consider using Render's database add-ons for production
   - Set up automated backups

Your Inventory Management System is now live and accessible to users! 🚀
