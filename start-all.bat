@echo off
echo ========================================
echo STARTING COMPLETE APPLICATION
echo ========================================

echo 1. Starting Backend Server...
start "Backend Server" cmd /k "cd backend && php artisan migrate --force && echo Backend ready at http://localhost:8000 && php artisan serve"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo 2. Testing backend connection...
:check_backend
curl -s http://localhost:8000/api/users > nul 2>&1
if %errorlevel% neq 0 (
    echo Waiting for backend...
    timeout /t 2 /nobreak > nul
    goto check_backend
)

echo ✅ Backend is running!

echo.
echo 3. Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && echo Frontend ready at http://localhost:4200 && ng serve --open"

echo.
echo ========================================
echo APPLICATION STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:4200
echo API: http://localhost:8000/api/
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause
