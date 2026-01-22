# Deployment Guide

This guide will help you deploy the Smart City Resource Optimization System to Vercel (Frontend) and Render (Backend).

## Prerequisites

1. GitHub account
2. Vercel account (free tier available)
3. Render account (free tier available)

## Step 1: Push Code to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub and push:
```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: smart-city-backend
   - **Environment**: Python 3
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && gunicorn app:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: Leave empty (or set to `backend` if needed)
5. Click "Create Web Service"
6. Wait for deployment to complete
7. Copy the deployment URL (e.g., `https://smart-city-backend.onrender.com`)

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
5. Add Environment Variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: Your Render backend URL (e.g., `https://smart-city-backend.onrender.com`)
6. Click "Deploy"
7. Wait for deployment to complete
8. Copy the deployment URL (e.g., `https://your-app.vercel.app`)

## Alternative: Deploy Both to Vercel

If you prefer to use Vercel for both frontend and backend:

### Backend on Vercel (Serverless Functions)

1. Create `api/index.py` in the root directory
2. Vercel will automatically detect Python and deploy as serverless functions
3. Note: ML models might need adjustment for serverless environment

## Environment Variables

### Backend (Render)
- `PYTHON_VERSION`: 3.11.0
- `PORT`: Automatically set by Render

### Frontend (Vercel)
- `REACT_APP_API_URL`: Your backend URL from Render

## Post-Deployment

1. Update CORS settings in `backend/app.py` if needed
2. Test all API endpoints
3. Verify frontend can connect to backend
4. Check browser console for any CORS errors

## Troubleshooting

### Backend Issues
- Ensure all model files (`.pkl`, `.h5`) are committed to repository
- Check Render logs for import errors
- Verify Python version compatibility

### Frontend Issues
- Check environment variable is set correctly
- Verify API URL in browser network tab
- Check CORS headers in backend response

## Deployment Links

After deployment, you'll have:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://smart-city-backend.onrender.com`

