@echo off
echo ========================================
echo CHECKING LARAVEL LOGS
echo ========================================

cd backend

echo 1. Checking if log file exists...
if exist "storage\logs\laravel.log" (
    echo ✅ Log file found
    echo.
    echo 2. Showing last 20 lines of Laravel log:
    echo ========================================
    powershell "Get-Content storage\logs\laravel.log -Tail 20"
    echo ========================================
) else (
    echo ❌ No log file found yet
    echo This might mean no errors have been logged yet
)

echo.
echo 3. Testing database connection...
php artisan tinker --execute="
try {
    DB::connection()->getPdo();
    echo 'Database connection: OK';
} catch (Exception \$e) {
    echo 'Database connection error: ' . \$e->getMessage();
}
"

echo.
echo 4. Checking users table structure...
php artisan tinker --execute="
try {
    \$columns = Schema::getColumnListing('users');
    echo 'Users table columns: ' . implode(', ', \$columns);
    if (in_array('specialite', \$columns)) {
        echo '\nspecialite column: EXISTS ✅';
    } else {
        echo '\nspecialite column: MISSING ❌';
    }
} catch (Exception \$e) {
    echo 'Error checking table: ' . \$e->getMessage();
}
"

echo.
echo ========================================
echo Log check completed!
echo ========================================
pause
