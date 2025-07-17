@echo off
echo ========================================
echo STARTING BACKEND SERVER
echo ========================================

cd backend

echo 1. Checking if server is already running...
curl -s http://localhost:8000/api/users > nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Backend server is already running on http://localhost:8000
    echo.
    echo Testing API endpoint...
    curl -X GET "http://localhost:8000/api/users?role=formateur" -H "Accept: application/json"
    echo.
    echo ========================================
    echo Backend is ready!
    echo ========================================
    pause
    exit /b 0
)

echo ❌ Backend server is not running. Starting it now...
echo.

echo 2. Running migrations...
php artisan migrate --force

echo.
echo 3. Starting Laravel development server...
echo ✅ Backend will be available at: http://localhost:8000
echo ✅ API endpoints at: http://localhost:8000/api/
echo.
echo Press Ctrl+C to stop the server
echo ========================================

php artisan serve
