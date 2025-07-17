@echo off
echo ========================================
echo DEBUGGING BACKEND ISSUES
echo ========================================

cd backend

echo.
echo 1. Checking if Laravel server is running...
curl -s http://localhost:8000/api/users > nul
if %errorlevel% == 0 (
    echo ✅ Backend server is responding
) else (
    echo ❌ Backend server is not responding
    echo Please run: php artisan serve
    pause
    exit /b 1
)

echo.
echo 2. Running migrations...
php artisan migrate --force

echo.
echo 3. Checking database structure...
php artisan tinker --execute="echo 'Users table columns: '; Schema::getColumnListing('users');"

echo.
echo 4. Testing user creation...
php artisan tinker --execute="
try {
    \$user = new App\Models\User();
    \$user->first_name = 'Test';
    \$user->last_name = 'User';
    \$user->email = 'test@example.com';
    \$user->password = bcrypt('password');
    \$user->role = 'formateur';
    \$user->specialite = 'Test Speciality';
    \$user->save();
    echo 'User created successfully with ID: ' . \$user->id;
    \$user->delete();
    echo ' (and deleted)';
} catch (Exception \$e) {
    echo 'Error creating user: ' . \$e->getMessage();
}
"

echo.
echo 5. Checking API endpoint...
curl -X GET "http://localhost:8000/api/users?role=formateur" -H "Accept: application/json"

echo.
echo ========================================
echo Debug completed!
echo ========================================
pause
