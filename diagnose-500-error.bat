@echo off
echo ========================================
echo DIAGNOSING 500 INTERNAL SERVER ERROR
echo ========================================

echo Step 1: Checking Laravel logs...
call check-logs.bat

echo.
echo Step 2: Fixing database issues...
call fix-database.bat

echo.
echo Step 3: Testing API with detailed output...
php test-api-detailed.php

echo.
echo Step 4: Checking server status...
curl -X GET "http://localhost:8000/api/users?role=formateur" -H "Accept: application/json"

echo.
echo ========================================
echo DIAGNOSIS COMPLETE
echo ========================================
echo.
echo If the problem persists:
echo 1. Check the Laravel logs above for specific error messages
echo 2. Ensure the database connection is working
echo 3. Verify the specialite column exists in users table
echo 4. Check that all required fields are being sent
echo.
echo Next steps:
echo - If migration issues: Run fix-database.bat again
echo - If validation issues: Check the detailed API test output
echo - If database issues: Check your .env file configuration
echo.
pause
