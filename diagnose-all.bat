@echo off
echo ========================================
echo COMPLETE DIAGNOSIS FOR "FAILED TO SAVE"
echo ========================================

echo.
echo Step 1: Running backend diagnosis...
call debug-backend.bat

echo.
echo Step 2: Testing API with PHP...
php test-api-simple.php

echo.
echo Step 3: Opening frontend debug page...
start debug-frontend.html

echo.
echo Step 4: Opening API test page...
start test-trainer-api.html

echo.
echo ========================================
echo DIAGNOSIS COMPLETE
echo ========================================
echo.
echo Please check:
echo 1. The backend debug output above
echo 2. The frontend debug page that opened
echo 3. The API test page that opened
echo 4. Browser console for any JavaScript errors
echo.
echo Common issues and solutions:
echo - Migration not run: Run 'php artisan migrate' in backend folder
echo - Server not running: Run 'php artisan serve' in backend folder
echo - CORS issues: Check backend/config/cors.php
echo - Database connection: Check backend/.env file
echo - Frontend proxy: Start with 'ng serve --proxy-config proxy.conf.json'
echo.
pause
