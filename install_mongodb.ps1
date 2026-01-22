# MongoDB Installation Helper Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MongoDB Setup for Smart City System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB service exists
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue

if ($mongoService) {
    Write-Host "MongoDB service found!" -ForegroundColor Green
    Write-Host "Current status: $($mongoService.Status)" -ForegroundColor Yellow
    
    if ($mongoService.Status -eq "Stopped") {
        Write-Host "Starting MongoDB service..." -ForegroundColor Yellow
        try {
            Start-Service MongoDB
            Write-Host "MongoDB service started successfully!" -ForegroundColor Green
        } catch {
            Write-Host "Failed to start MongoDB. Try running as Administrator." -ForegroundColor Red
            Write-Host "Error: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "MongoDB service is already running!" -ForegroundColor Green
    }
    
    # Test connection
    Write-Host ""
    Write-Host "Testing MongoDB connection..." -ForegroundColor Yellow
    $connection = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet -WarningAction SilentlyContinue
    
    if ($connection) {
        Write-Host "MongoDB is accessible on port 27017!" -ForegroundColor Green
        Write-Host ""
        Write-Host "You can now restart your backend server!" -ForegroundColor Cyan
    } else {
        Write-Host "MongoDB service is running but port 27017 is not accessible" -ForegroundColor Red
        Write-Host "Check firewall settings or MongoDB configuration" -ForegroundColor Yellow
    }
} else {
    Write-Host "MongoDB is not installed." -ForegroundColor Red
    Write-Host ""
    Write-Host "To install MongoDB:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://www.mongodb.com/try/download/community" -ForegroundColor White
    Write-Host "2. Run the installer" -ForegroundColor White
    Write-Host "3. Make sure to check 'Install MongoDB as a Service'" -ForegroundColor White
    Write-Host "4. Run this script again after installation" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use MongoDB Atlas (cloud - free):" -ForegroundColor Yellow
    Write-Host "1. Go to: https://www.mongodb.com/cloud/atlas/register" -ForegroundColor White
    Write-Host "2. Create free cluster" -ForegroundColor White
    Write-Host "3. Get connection string" -ForegroundColor White
    Write-Host "4. Update backend/.env file with connection string" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
