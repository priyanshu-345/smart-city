# MongoDB Setup Guide for Windows

## Option 1: Install MongoDB Community Edition (Recommended)

### Step 1: Download MongoDB
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.0 or 6.0)
   - Platform: Windows
   - Package: MSI
3. Click "Download"

### Step 2: Install MongoDB
1. Run the downloaded `.msi` file
2. Choose "Complete" installation
3. **IMPORTANT**: Check "Install MongoDB as a Service"
4. Check "Run service as Network Service user"
5. Check "Install MongoDB Compass" (optional GUI tool)
6. Click "Install"

### Step 3: Verify Installation
Open PowerShell and run:
```powershell
Get-Service MongoDB
```

You should see MongoDB service running.

### Step 4: Start MongoDB Service
If not running, start it:
```powershell
Start-Service MongoDB
```

## Option 2: Use MongoDB Atlas (Cloud - Free)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Update `.env` file with your connection string

## Option 3: Use Docker (If you have Docker)

```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## After Installation

1. MongoDB will run on `localhost:27017` by default
2. Restart your backend server
3. The system will automatically connect to MongoDB

## Test Connection

Run this in PowerShell:
```powershell
python -c "from pymongo import MongoClient; client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=2000); print('Connected!' if client.server_info() else 'Failed')"
```

## Troubleshooting

**Service won't start?**
- Check if port 27017 is already in use
- Run PowerShell as Administrator
- Check Windows Event Viewer for errors

**Connection refused?**
- Make sure MongoDB service is running
- Check firewall settings
- Verify port 27017 is not blocked

