@echo off
echo ========================================
echo Starting React Frontend
echo ========================================
cd /d %~dp0
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo Starting React development server...
call npm start
pause

