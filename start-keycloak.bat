@echo off
echo Starting Keycloak with Docker Compose...
echo.

REM Create directories if they don't exist
if not exist "keycloak\themes" mkdir keycloak\themes
if not exist "keycloak\imports" mkdir keycloak\imports

echo Starting Keycloak server...
docker compose -f docker-compose.keycloak.yml up -d

echo.
echo Waiting for Keycloak to start...
timeout /t 30 /nobreak > nul

echo.
echo Keycloak is starting up. Please wait a few moments and then access:
echo.
echo Admin Console: http://localhost:8090/admin
echo Username: admin
echo Password: admin123
echo.
echo Realm: formation
echo Frontend Client: formation-frontend
echo Backend Client: formation-backend
echo.
echo Test Users:
echo - admin@formation.com / admin123 (Admin)
echo - trainer@formation.com / trainer123 (Trainer)  
echo - employee@formation.com / employee123 (Employee)
echo.

pause
