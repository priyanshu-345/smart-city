# Script to setup .env file with backend URL
# Run this after deploying backend to Render

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Frontend Environment Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendUrl = Read-Host "Enter your Render backend URL (e.g., https://smart-city-backend.onrender.com)"

if ([string]::IsNullOrWhiteSpace($backendUrl)) {
    Write-Host "Backend URL is required!" -ForegroundColor Red
    exit
}

# Remove trailing slash if present
$backendUrl = $backendUrl.TrimEnd('/')

# Create .env file in frontend directory
$envContent = @"
# Backend API URL
REACT_APP_API_URL=$backendUrl
"@

$envPath = "frontend\.env"
$envContent | Out-File -FilePath $envPath -Encoding utf8 -Force

Write-Host ""
Write-Host ".env file created successfully!" -ForegroundColor Green
Write-Host "Location: $envPath" -ForegroundColor Gray
Write-Host "Backend URL: $backendUrl" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Rebuild frontend: cd frontend && npm run build" -ForegroundColor White
Write-Host "2. Push to GitHub: git add . && git commit -m 'Add backend URL' && git push" -ForegroundColor White
Write-Host ""

