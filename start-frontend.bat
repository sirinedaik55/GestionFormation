@echo off
echo ========================================
echo STARTING FRONTEND SERVER
echo ========================================

cd frontend

echo 1. Checking if backend is running...
curl -s http://localhost:8000/api/users > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Backend server is running
) else (
    echo ❌ Backend server is not running!
    echo Please run start-backend.bat first
    pause
    exit /b 1
)

echo.
echo 2. Starting Angular development server...
echo ✅ Frontend will be available at: http://localhost:4200
echo ✅ Backend API at: http://localhost:8000/api/
echo.
echo Note: Services are configured to connect directly to backend
echo No proxy needed with current configuration
echo.
echo Press Ctrl+C to stop the server
echo ========================================

ng serve --open
