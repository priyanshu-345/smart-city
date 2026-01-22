# Quick Deployment Guide

## Option 1: Deploy to Vercel (Recommended)

### Frontend Deployment (Vercel)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel --yes
   ```
   - When prompted, press Enter to accept defaults
   - Note the deployment URL (e.g., `https://your-app.vercel.app`)

4. **Set Environment Variable**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `<your-backend-url>`
   - Redeploy the project

### Backend Deployment (Render)

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
3. **Configure**:
   - **Name**: `smart-city-backend`
   - **Environment**: `Python 3`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --host 0.0.0.0 --port $PORT`
4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy the URL (e.g., `https://smart-city-backend.onrender.com`)

5. **Update Frontend Environment Variable**:
   - Go back to Vercel Dashboard
   - Update `REACT_APP_API_URL` with your Render backend URL
   - Redeploy frontend

---

## Option 2: Deploy to Netlify

### Frontend Deployment (Netlify)

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy Frontend**:
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod
   ```
   - Follow the prompts to create a new site
   - Note the deployment URL

4. **Set Environment Variable**:
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Select your site → Site settings → Environment variables
   - Add: `REACT_APP_API_URL` = `<your-backend-url>`
   - Redeploy

### Backend Deployment (Render - Same as above)

Use the same Render deployment steps as in Option 1.

---

## Option 3: Deploy Both to Vercel

### Frontend (Same as Option 1)

### Backend on Vercel (Serverless)

1. **Create API directory structure**:
   - Vercel automatically detects Python files in `api/` directory
   - You may need to refactor Flask app for serverless

2. **Deploy**:
   ```bash
   vercel --prod
   ```

**Note**: ML models might need adjustment for serverless environment due to size limits.

---

## After Deployment

1. **Frontend URL**: `https://your-app.vercel.app` or `https://your-app.netlify.app`
2. **Backend URL**: `https://smart-city-backend.onrender.com`

3. **Test the deployment**:
   - Open frontend URL in browser
   - Check browser console for errors
   - Test login functionality
   - Test prediction features

---

## Troubleshooting

### CORS Errors
- Update `backend/app.py` CORS settings to include your frontend URL
- Redeploy backend

### Environment Variables Not Working
- Make sure variable name starts with `REACT_APP_` for React apps
- Redeploy after adding variables

### Backend Not Starting
- Check Render logs for errors
- Verify all model files are in repository
- Check Python version compatibility

---

## Quick Commands

```bash
# Deploy frontend to Vercel
cd frontend
vercel login
vercel --yes

# Deploy frontend to Netlify
cd frontend
npm run build
netlify login
netlify deploy --prod

# Check deployment status
vercel ls
# or
netlify status
```

