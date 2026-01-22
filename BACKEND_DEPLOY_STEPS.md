# Backend Deployment Steps (Render)

## Step 1: Login to Render
1. Go to: https://dashboard.render.com/
2. Sign in with GitHub (recommended) or email

## Step 2: Create New Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Connect your GitHub repository: `priyanshu-345/smart-city`

## Step 3: Configure Backend Service

**Basic Settings:**
- **Name**: `smart-city-backend`
- **Environment**: `Python 3`
- **Region**: Choose closest to you (e.g., Singapore, US East)

**Build & Deploy:**
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app --host 0.0.0.0 --port $PORT`

**Advanced Settings:**
- **Python Version**: `3.11.0` (or leave default)
- **Plan**: `Free` (for testing)

## Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Watch the logs for any errors

## Step 5: Get Backend URL
After successful deployment, you'll see:
- **URL**: `https://smart-city-backend.onrender.com` (or similar)
- Copy this URL

## Step 6: Update Frontend .env File
1. Open `frontend/.env` file
2. Replace `http://localhost:5000` with your Render backend URL
3. Example: `REACT_APP_API_URL=https://smart-city-backend.onrender.com`

## Step 7: Test Backend
Open your backend URL in browser:
- Should show: `{"message": "Smart City Resource Optimization API", ...}`
- If you see this, backend is working! ✅

---

**Note**: Free tier on Render spins down after 15 minutes of inactivity. First request after spin-down may take 30-60 seconds.

