# Setup Instructions

## Prerequisites

1. **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
2. **Node.js 16+** - [Download Node.js](https://nodejs.org/)
3. **MongoDB** (Optional) - [Download MongoDB](https://www.mongodb.com/try/download/community)
4. **Git** - [Download Git](https://git-scm.com/downloads)

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Create virtual environment (Recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Generate data and train models
```bash
# Option 1: Run setup script
python setup.py

# Option 2: Run manually
cd data
python generate_data.py
cd ../models
python train_models.py
cd ..
```

### 5. Configure environment (Optional)
Create a `.env` file in the backend directory:
```
MONGO_URI=mongodb://localhost:27017/
DB_NAME=smart_city_db
```

### 6. Start Flask server
```bash
python app.py
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start React development server
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## MongoDB Setup (Optional)

If you want to use MongoDB for data persistence:

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   ```
3. MongoDB will run on `mongodb://localhost:27017/` by default

## Quick Start (Without MongoDB)

The system works without MongoDB. All predictions will still work, but data won't be persisted.

1. Start backend: `cd backend && python app.py`
2. Start frontend: `cd frontend && npm start`
3. Open browser: `http://localhost:3000`
4. Login with any credentials (demo mode)

## Troubleshooting

### Backend Issues

**Error: Models not found**
- Run `python setup.py` to generate data and train models

**Error: Port 5000 already in use**
- Change port in `app.py`: `app.run(port=5001)`

**Error: TensorFlow/Keras issues**
- Make sure you have Python 3.8-3.11 (TensorFlow 2.15 supports these versions)
- Try: `pip install tensorflow==2.15.0 --upgrade`

### Frontend Issues

**Error: Cannot find module**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

**Error: Port 3000 already in use**
- React will automatically use the next available port

### MongoDB Issues

**Connection refused**
- Make sure MongoDB service is running
- Check if MongoDB is installed correctly
- The system works without MongoDB (demo mode)

## Project Structure

```
ai/
├── backend/
│   ├── app.py              # Flask main application
│   ├── setup.py            # Setup script
│   ├── requirements.txt    # Python dependencies
│   ├── data/              # Data generation scripts
│   ├── models/            # ML model training
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
│   └── package.json       # Node dependencies
└── README.md
```

## Testing the System

1. **Login**: Use any username/password (demo mode)
2. **Traffic Prediction**: 
   - Go to Traffic page
   - Fill in the form (hour, day, month, temperature, weather)
   - Click "Predict Traffic"
3. **Energy Prediction**:
   - Go to Energy page
   - Fill in the form
   - Click "Predict Energy Consumption"
4. **Other Modules**: Similar process for Water, Waste, and Air Quality

## Production Deployment

### Backend (Flask)
- Use Gunicorn: `gunicorn app:app`
- Set `debug=False` in production
- Use environment variables for sensitive data

### Frontend (React)
- Build: `npm run build`
- Serve with Nginx or similar
- Update API URL in `.env` file

### Deployment Options
- **Render**: Free tier available
- **Railway**: Easy deployment
- **AWS EC2**: Full control
- **Heroku**: Simple deployment

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in console
3. Ensure all dependencies are installed correctly





