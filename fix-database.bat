@echo off
echo ========================================
echo FIXING DATABASE ISSUES
echo ========================================

cd backend

echo 1. Checking current migration status...
php artisan migrate:status

echo.
echo 2. Running all pending migrations...
php artisan migrate --force

echo.
echo 3. Verifying specialite column exists...
php artisan tinker --execute="
try {
    \$columns = Schema::getColumnListing('users');
    echo 'Users table columns: ' . implode(', ', \$columns) . '\n';
    if (in_array('specialite', \$columns)) {
        echo 'specialite column: EXISTS ✅\n';
    } else {
        echo 'specialite column: MISSING ❌\n';
        echo 'Creating specialite column manually...\n';
        Schema::table('users', function(\$table) {
            \$table->string('specialite')->nullable();
        });
        echo 'specialite column created ✅\n';
    }
} catch (Exception \$e) {
    echo 'Error: ' . \$e->getMessage() . '\n';
}
"

echo.
echo 4. Testing user creation...
php artisan tinker --execute="
try {
    \$user = new App\Models\User();
    \$user->first_name = 'Test';
    \$user->last_name = 'User';
    \$user->email = 'test' . time() . '@example.com';
    \$user->password = bcrypt('password');
    \$user->role = 'formateur';
    \$user->specialite = 'Test Speciality';
    \$user->save();
    echo 'Test user created successfully with ID: ' . \$user->id . '\n';
    \$user->delete();
    echo 'Test user deleted\n';
    echo 'Database is working correctly ✅\n';
} catch (Exception \$e) {
    echo 'Error creating user: ' . \$e->getMessage() . '\n';
}
"

echo.
echo ========================================
echo Database fix completed!
echo ========================================
pause
