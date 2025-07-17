@echo off
echo Running migration to add specialite field to users table...
cd backend
php artisan migrate
echo Migration completed!
pause
