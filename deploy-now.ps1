# Smart City - Quick Deployment Script
# This will guide you through deploying to Vercel and Render

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Smart City Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if logged into Vercel
Write-Host "Step 1: Checking Vercel authentication..." -ForegroundColor Yellow
$vercelCheck = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged into Vercel. Please login:" -ForegroundColor Red
    Write-Host "  Run: vercel login" -ForegroundColor White
    Write-Host ""
    $login = Read-Host "Would you like to login now? (y/n)"
    if ($login -eq "y" -or $login -eq "Y") {
        vercel login
    } else {
        Write-Host "Please login manually and run this script again." -ForegroundColor Yellow
        exit
    }
} else {
    Write-Host "Logged in as: $vercelCheck" -ForegroundColor Green
}

# Step 2: Deploy Frontend
Write-Host ""
Write-Host "Step 2: Deploying Frontend to Vercel..." -ForegroundColor Yellow
Write-Host "Navigate to frontend directory..." -ForegroundColor Gray
cd frontend

Write-Host "Deploying..." -ForegroundColor Gray
$frontendDeploy = vercel --yes 2>&1
Write-Host $frontendDeploy

# Extract deployment URL
$frontendUrl = ""
if ($frontendDeploy -match "https://[^\s]+\.vercel\.app") {
    $frontendUrl = $matches[0]
    Write-Host ""
    Write-Host "Frontend deployed to: $frontendUrl" -ForegroundColor Green
} else {
    Write-Host "Please check the output above for your frontend URL" -ForegroundColor Yellow
}

cd ..

# Step 3: Instructions for Backend
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 3: Backend Deployment (Render)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To deploy the backend:" -ForegroundColor Yellow
Write-Host "1. Go to: https://dashboard.render.com/" -ForegroundColor White
Write-Host "2. Click 'New +' → 'Web Service'" -ForegroundColor White
Write-Host "3. Connect your GitHub repository" -ForegroundColor White
Write-Host "4. Configure:" -ForegroundColor White
Write-Host "   - Name: smart-city-backend" -ForegroundColor Gray
Write-Host "   - Environment: Python 3" -ForegroundColor Gray
Write-Host "   - Root Directory: backend" -ForegroundColor Gray
Write-Host "   - Build Command: pip install -r requirements.txt" -ForegroundColor Gray
Write-Host "   - Start Command: gunicorn app:app --host 0.0.0.0 --port `$PORT" -ForegroundColor Gray
Write-Host "5. Click 'Create Web Service'" -ForegroundColor White
Write-Host "6. Wait for deployment (5-10 minutes)" -ForegroundColor White
Write-Host "7. Copy the backend URL" -ForegroundColor White
Write-Host ""

# Step 4: Set Environment Variable
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 4: Configure Environment Variable" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
$backendUrl = Read-Host "Enter your Render backend URL (or press Enter to skip)"
if ($backendUrl) {
    Write-Host ""
    Write-Host "To set the environment variable:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "2. Select your project" -ForegroundColor White
    Write-Host "3. Go to Settings → Environment Variables" -ForegroundColor White
    Write-Host "4. Add: REACT_APP_API_URL = $backendUrl" -ForegroundColor White
    Write-Host "5. Redeploy your frontend" -ForegroundColor White
    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
if ($frontendUrl) {
    Write-Host "Frontend URL: $frontendUrl" -ForegroundColor Green
}
if ($backendUrl) {
    Write-Host "Backend URL: $backendUrl" -ForegroundColor Green
}
Write-Host ""
Write-Host "Don't forget to:" -ForegroundColor Yellow
Write-Host "- Set REACT_APP_API_URL environment variable in Vercel" -ForegroundColor White
Write-Host "- Update CORS settings in backend if needed" -ForegroundColor White
Write-Host "- Test your deployment!" -ForegroundColor White
Write-Host ""

