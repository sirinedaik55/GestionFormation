<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Keycloak Authentication routes
Route::prefix('auth')->group(function () {
    // Public routes
    Route::post('login', [App\Http\Controllers\KeycloakAuthController::class, 'login']);
    Route::post('refresh', [App\Http\Controllers\KeycloakAuthController::class, 'refresh']);
    Route::get('config', [App\Http\Controllers\KeycloakAuthController::class, 'config']);

    // Protected routes
    Route::middleware(['keycloak'])->group(function () {
        Route::get('me', [App\Http\Controllers\KeycloakAuthController::class, 'me']);
        Route::post('logout', [App\Http\Controllers\KeycloakAuthController::class, 'logout']);
        Route::post('validate', [App\Http\Controllers\KeycloakAuthController::class, 'validateToken']);
    });
});

// Development/Mock Authentication routes (when Keycloak is not available)
Route::prefix('auth/mock')->group(function () {
    Route::post('login', [App\Http\Controllers\KeycloakAuthController::class, 'mockLogin']);
    Route::get('config', [App\Http\Controllers\KeycloakAuthController::class, 'mockConfig']);
});

// Temporary test routes (unprotected) - for debugging database content
Route::prefix('test')->group(function () {
    Route::get('users', [App\Http\Controllers\UserController::class, 'index']);
    Route::get('teams', [App\Http\Controllers\TeamController::class, 'index']);
    Route::get('formations', [App\Http\Controllers\FormationController::class, 'index']);
    Route::get('statistics/dashboard', [App\Http\Controllers\StatisticsController::class, 'dashboard']);
    Route::get('statistics/monthly', [App\Http\Controllers\StatisticsController::class, 'monthly']);
    Route::get('statistics/formations', [App\Http\Controllers\StatisticsController::class, 'formations']);
    Route::get('statistics/teams', [App\Http\Controllers\StatisticsController::class, 'teams']);
    Route::get('statistics/employees', [App\Http\Controllers\StatisticsController::class, 'employees']);
});

// Protected API routes with Keycloak
Route::middleware(['keycloak'])->group(function () {

    // CRUD utilisateurs (employés et formateurs) - Admin only
    Route::apiResource('users', App\Http\Controllers\UserController::class)->middleware('keycloak:admin');

// CRUD formations
Route::apiResource('formations', App\Http\Controllers\FormationController::class);

// Gestion des participants aux formations
Route::get('formations/{id}/participants', [App\Http\Controllers\FormationController::class, 'getParticipants']);
Route::put('formations/{formationId}/participants/{participantId}', [App\Http\Controllers\FormationController::class, 'updateParticipantStatus']);

// CRUD équipes
Route::apiResource('teams', App\Http\Controllers\TeamController::class);

// Statistiques
Route::prefix('statistics')->group(function () {
    Route::get('dashboard', [App\Http\Controllers\StatisticsController::class, 'dashboard']);
    Route::get('formations', [App\Http\Controllers\StatisticsController::class, 'formations']);
    Route::get('teams', [App\Http\Controllers\StatisticsController::class, 'teams']);
    Route::get('employees', [App\Http\Controllers\StatisticsController::class, 'employees']);
    Route::get('monthly', [App\Http\Controllers\StatisticsController::class, 'monthly']);

    // Export endpoints
    Route::post('export/pdf', [App\Http\Controllers\StatisticsController::class, 'exportToPDF']);
    Route::post('export/csv', [App\Http\Controllers\StatisticsController::class, 'exportToCSV']);
});

// Reports
Route::prefix('reports')->group(function () {
    Route::post('attendance', [App\Http\Controllers\ReportsController::class, 'attendanceReport']);
    Route::post('formations', [App\Http\Controllers\ReportsController::class, 'formationReport']);
    Route::post('teams', [App\Http\Controllers\ReportsController::class, 'teamReport']);

    // PDF exports
    Route::post('attendance/pdf', [App\Http\Controllers\ReportsController::class, 'exportAttendancePDF']);
    Route::post('formations/pdf', [App\Http\Controllers\ReportsController::class, 'exportFormationPDF']);
    Route::post('teams/pdf', [App\Http\Controllers\ReportsController::class, 'exportTeamPDF']);

    // CSV exports
    Route::post('attendance/csv', [App\Http\Controllers\ReportsController::class, 'exportAttendanceCSV']);
    Route::post('formations/csv', [App\Http\Controllers\ReportsController::class, 'exportFormationCSV']);
    Route::post('teams/csv', [App\Http\Controllers\ReportsController::class, 'exportTeamCSV']);
});

// Settings
Route::prefix('settings')->group(function () {
    Route::get('/', [App\Http\Controllers\SettingsController::class, 'index']);
    Route::get('system', [App\Http\Controllers\SettingsController::class, 'getSystemSettings']);
    Route::get('notifications', [App\Http\Controllers\SettingsController::class, 'getNotificationSettings']);
    Route::get('security', [App\Http\Controllers\SettingsController::class, 'getSecuritySettings']);

    Route::put('system', [App\Http\Controllers\SettingsController::class, 'updateSystemSettings']);
    Route::put('notifications', [App\Http\Controllers\SettingsController::class, 'updateNotificationSettings']);
    Route::put('security', [App\Http\Controllers\SettingsController::class, 'updateSecuritySettings']);

    Route::post('reset', [App\Http\Controllers\SettingsController::class, 'resetSettings']);
    Route::get('export', [App\Http\Controllers\SettingsController::class, 'exportSettings']);
    Route::post('import', [App\Http\Controllers\SettingsController::class, 'importSettings']);

    Route::post('backup', [App\Http\Controllers\SettingsController::class, 'performBackup']);
    Route::post('clear-cache', [App\Http\Controllers\SettingsController::class, 'clearCache']);
    Route::get('system-info', [App\Http\Controllers\SettingsController::class, 'getSystemInfo']);
});

    // Affecter un employé à une équipe
    Route::put('users/{user}/team', [App\Http\Controllers\UserController::class, 'updateTeam']);

});
