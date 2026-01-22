# 🚀 Backend Deploy करें - Quick Guide

## Step 1: Render पर Login करें
1. Browser में खोलें: https://dashboard.render.com/
2. GitHub से login करें (recommended)

## Step 2: New Web Service बनाएं
1. "New +" button click करें
2. "Web Service" select करें
3. GitHub repository connect करें: `priyanshu-345/smart-city`

## Step 3: Configuration
```
Name: smart-city-backend
Environment: Python 3
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app --host 0.0.0.0 --port $PORT
Plan: Free
```

## Step 4: Deploy
1. "Create Web Service" click करें
2. 5-10 minutes wait करें
3. Deployment complete होने पर URL copy करें

## Step 5: Backend URL सेट करें

### Option A: Script use करें (Easy)
```powershell
.\setup-env.ps1
```
Script आपसे backend URL पूछेगी और automatically .env file बना देगी।

### Option B: Manual
1. `frontend/.env` file खोलें (create करें अगर नहीं है)
2. इसमें लिखें:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## Step 6: Test करें
Browser में backend URL खोलें:
- Should show: `{"message": "Smart City Resource Optimization API"}`

---

**Important**: Backend URL मिलने के बाद `setup-env.ps1` script run करें!

