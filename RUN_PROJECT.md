# 🚀 Project Run Commands

## Quick Start (Easiest Way)

### Option 1: Use Batch Files (Windows)

**Double-click these files:**
- `start_all.bat` - Starts both backend and frontend automatically

**OR run individually:**
- `start_backend.bat` - Only backend
- `start_frontend.bat` - Only frontend

---

## Manual Commands

### Step 1: Start Backend (Terminal 1)

```powershell
cd backend
python app.py
```

**Expected Output:**
```
Starting Smart City Resource Optimization API...
API running on http://localhost:5000
```

---

### Step 2: Start Frontend (Terminal 2 - New Window)

```powershell
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view smart-city-frontend in the browser.
  Local:            http://localhost:3000
```

---

## Complete Setup (First Time Only)

### 1. Install Backend Dependencies
```powershell
cd backend
pip install -r requirements.txt
```

### 2. Generate Data & Train Models
```powershell
cd backend
python setup.py
```

### 3. Install Frontend Dependencies
```powershell
cd frontend
npm install
```

---

## Quick Commands Summary

### Backend Only
```powershell
cd backend
python app.py
```

### Frontend Only
```powershell
cd frontend
npm start
```

### Both (Separate Windows)
```powershell
# Window 1:
cd backend
python app.py

# Window 2:
cd frontend
npm start
```

---

## Access URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## Troubleshooting

### Backend won't start?
```powershell
# Check if port 5000 is free
netstat -ano | findstr :5000

# Install dependencies
cd backend
pip install -r requirements.txt
```

### Frontend won't start?
```powershell
# Install dependencies
cd frontend
npm install

# Clear cache
npm cache clean --force
```

### Models not loading?
```powershell
cd backend
python setup.py
```

---

## Stop Servers

- **Backend:** Press `Ctrl+C` in backend terminal
- **Frontend:** Press `Ctrl+C` in frontend terminal
