# Smart City Deployment Helper Script
# This script helps prepare your project for deployment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Smart City Deployment Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
Write-Host "Checking Git repository..." -ForegroundColor Yellow
$gitStatus = git status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Git repository not found. Initializing..." -ForegroundColor Yellow
    git init
    Write-Host "Git repository initialized!" -ForegroundColor Green
} else {
    Write-Host "Git repository found!" -ForegroundColor Green
}

# Stage all files
Write-Host ""
Write-Host "Staging files for commit..." -ForegroundColor Yellow
git add .
Write-Host "Files staged!" -ForegroundColor Green

# Check if there are changes to commit
$changes = git diff --cached --name-only
if ($changes) {
    Write-Host ""
    Write-Host "Changes ready to commit:" -ForegroundColor Yellow
    $changes | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
    Write-Host ""
    $commit = Read-Host "Commit message (or press Enter to skip)"
    if ($commit) {
        git commit -m $commit
        Write-Host "Changes committed!" -ForegroundColor Green
    }
} else {
    Write-Host "No changes to commit." -ForegroundColor Yellow
}

# Check for remote
Write-Host ""
Write-Host "Checking for remote repository..." -ForegroundColor Yellow
$remote = git remote get-url origin 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "No remote repository found." -ForegroundColor Yellow
    Write-Host "To deploy, you need to:" -ForegroundColor Cyan
    Write-Host "1. Create a repository on GitHub" -ForegroundColor White
    Write-Host "2. Run: git remote add origin <your-github-repo-url>" -ForegroundColor White
    Write-Host "3. Run: git push -u origin main" -ForegroundColor White
} else {
    Write-Host "Remote repository found: $remote" -ForegroundColor Green
    Write-Host ""
    $push = Read-Host "Push to remote? (y/n)"
    if ($push -eq "y" -or $push -eq "Y") {
        git push
        Write-Host "Pushed to remote!" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Deploy Backend to Render:" -ForegroundColor Yellow
Write-Host "   - Go to https://dashboard.render.com/" -ForegroundColor White
Write-Host "   - Create new Web Service" -ForegroundColor White
Write-Host "   - Connect your GitHub repo" -ForegroundColor White
Write-Host "   - Set Root Directory: backend" -ForegroundColor White
Write-Host "   - Set Start Command: gunicorn app:app --host 0.0.0.0 --port `$PORT" -ForegroundColor White
Write-Host ""
Write-Host "2. Deploy Frontend to Vercel:" -ForegroundColor Yellow
Write-Host "   - Go to https://vercel.com/dashboard" -ForegroundColor White
Write-Host "   - Import your GitHub repo" -ForegroundColor White
Write-Host "   - Set Root Directory: frontend" -ForegroundColor White
Write-Host "   - Add Environment Variable: REACT_APP_API_URL = <your-render-backend-url>" -ForegroundColor White
Write-Host ""
Write-Host "See DEPLOYMENT.md for detailed instructions!" -ForegroundColor Green
Write-Host ""

