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

// JWT Authentication routes
Route::prefix('auth')->group(function () {
    // Public routes
    Route::post('login', [App\Http\Controllers\AuthController::class, 'login']);
    Route::post('register', [App\Http\Controllers\AuthController::class, 'register']);

    // Protected routes
    Route::middleware(['auth:api'])->group(function () {
        Route::get('me', [App\Http\Controllers\AuthController::class, 'me']);
        Route::post('logout', [App\Http\Controllers\AuthController::class, 'logout']);
        Route::post('refresh', [App\Http\Controllers\AuthController::class, 'refresh']);
        Route::put('profile', [App\Http\Controllers\AuthController::class, 'updateProfile']);
        Route::put('change-password', [App\Http\Controllers\AuthController::class, 'changePassword']);
    });
});

// Attendance routes
Route::middleware(['auth:api'])->prefix('attendance')->group(function () {
    Route::get('formation/{formationId}/participants', [App\Http\Controllers\AttendanceController::class, 'getFormationParticipants']);
    Route::put('formation/{formationId}/participant/{participantId}', [App\Http\Controllers\AttendanceController::class, 'markAttendance']);
    Route::post('formation/{formationId}/submit', [App\Http\Controllers\AttendanceController::class, 'submitAttendance']);
    Route::get('history', [App\Http\Controllers\AttendanceController::class, 'getAttendanceHistory']);
    Route::get('statistics', [App\Http\Controllers\AttendanceController::class, 'getAttendanceStatistics']);
});

// Document routes
Route::middleware(['auth:api'])->prefix('documents')->group(function () {
    Route::get('formation/{formationId}', [App\Http\Controllers\DocumentController::class, 'getFormationDocuments']);
    Route::post('formation/{formationId}/upload', [App\Http\Controllers\DocumentController::class, 'uploadDocument']);
    Route::get('{documentId}/download', [App\Http\Controllers\DocumentController::class, 'downloadDocument'])->name('documents.download');
    Route::delete('{documentId}', [App\Http\Controllers\DocumentController::class, 'deleteDocument']);
    Route::get('all', [App\Http\Controllers\DocumentController::class, 'getAllDocuments']);
});

// Statistics routes
Route::middleware(['auth:api'])->prefix('statistics')->group(function () {
    Route::get('dashboard', [App\Http\Controllers\StatisticsController::class, 'getDashboardStats']);
    Route::get('formations', [App\Http\Controllers\StatisticsController::class, 'formations']);
    Route::get('teams', [App\Http\Controllers\StatisticsController::class, 'teams']);
    Route::get('employees', [App\Http\Controllers\StatisticsController::class, 'employees']);
    Route::get('monthly', [App\Http\Controllers\StatisticsController::class, 'monthly']);
    Route::post('export/pdf', [App\Http\Controllers\StatisticsController::class, 'exportToPDF']);
    Route::post('export/csv', [App\Http\Controllers\StatisticsController::class, 'exportToCSV']);
});

// Keycloak Authentication routes (disabled for now - using Laravel auth)
Route::prefix('auth/keycloak')->group(function () {
    // Main Keycloak endpoints
    Route::post('login', [App\Http\Controllers\KeycloakAuthController::class, 'login']);
    Route::get('config', [App\Http\Controllers\KeycloakAuthController::class, 'config']);
    Route::post('refresh', [App\Http\Controllers\KeycloakAuthController::class, 'refresh']);
    Route::post('logout', [App\Http\Controllers\KeycloakAuthController::class, 'logout']);
    Route::get('me', [App\Http\Controllers\KeycloakAuthController::class, 'me']);
    Route::post('validate', [App\Http\Controllers\KeycloakAuthController::class, 'validateToken']);
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
    Route::get('statistics/formations', function () {
        return response()->json([
            [
                'id' => 1,
                'name' => 'Angular Advanced Concepts',
                'date' => '2025-07-22T10:00:00',
                'totalParticipants' => 10,
                'presentCount' => 9,
                'absentCount' => 1,
                'attendanceRate' => 90.0,
                'team' => 'Development Team',
                'trainer' => 'Syrine Daik'
            ],
            [
                'id' => 2,
                'name' => 'Data Science with Python',
                'date' => '2025-07-07T14:00:00',
                'totalParticipants' => 15,
                'presentCount' => 12,
                'absentCount' => 3,
                'attendanceRate' => 80.0,
                'team' => 'Data Science Team',
                'trainer' => 'Marie Martin'
            ],
            [
                'id' => 3,
                'name' => 'Project Management Essentials',
                'date' => '2025-07-14T09:00:00',
                'totalParticipants' => 25,
                'presentCount' => 22,
                'absentCount' => 3,
                'attendanceRate' => 88.0,
                'team' => 'Marketing Team',
                'trainer' => 'Pierre Dubois'
            ],
            [
                'id' => 4,
                'name' => 'Digital Marketing Strategy',
                'date' => '2025-07-17T11:00:00',
                'totalParticipants' => 22,
                'presentCount' => 18,
                'absentCount' => 4,
                'attendanceRate' => 82.0,
                'team' => 'Marketing Team',
                'trainer' => 'Sophie Laurent'
            ],
            [
                'id' => 5,
                'name' => 'Cybersecurity Fundamentals',
                'date' => '2025-07-23T13:00:00',
                'totalParticipants' => 18,
                'presentCount' => 17,
                'absentCount' => 1,
                'attendanceRate' => 94.0,
                'team' => 'Security Team',
                'trainer' => 'Thomas Bernard'
            ]
        ]);
    });
    Route::get('statistics/teams', function () {
        return response()->json([
            [
                'id' => 1,
                'name' => 'Development Team',
                'speciality' => 'Web Development',
                'totalEmployees' => 5,
                'totalFormations' => 8,
                'attendanceRate' => 88.5,
                'averageFormationsPerEmployee' => 1.6
            ],
            [
                'id' => 2,
                'name' => 'Data Science Team',
                'speciality' => 'Data Analysis',
                'totalEmployees' => 4,
                'totalFormations' => 5,
                'attendanceRate' => 92.0,
                'averageFormationsPerEmployee' => 1.25
            ],
            [
                'id' => 3,
                'name' => 'Marketing Team',
                'speciality' => 'Digital Marketing',
                'totalEmployees' => 3,
                'totalFormations' => 3,
                'attendanceRate' => 85.0,
                'averageFormationsPerEmployee' => 1.0
            ],
            [
                'id' => 4,
                'name' => 'Design Team',
                'speciality' => 'UX/UI Design',
                'totalEmployees' => 2,
                'totalFormations' => 2,
                'attendanceRate' => 90.0,
                'averageFormationsPerEmployee' => 1.0
            ],
            [
                'id' => 5,
                'name' => 'Security Team',
                'speciality' => 'Cybersecurity',
                'totalEmployees' => 3,
                'totalFormations' => 4,
                'attendanceRate' => 87.5,
                'averageFormationsPerEmployee' => 1.33
            ]
        ]);
    });
    Route::get('statistics/employees', function () {
        return response()->json([
            [
                'id' => 1,
                'name' => 'John Doe',
                'email' => 'john.doe@formation.com',
                'team' => 'Development Team',
                'totalFormations' => 5,
                'presentCount' => 4,
                'absentCount' => 1,
                'attendanceRate' => 80.0
            ],
            [
                'id' => 2,
                'name' => 'Jane Smith',
                'email' => 'jane.smith@formation.com',
                'team' => 'Data Science Team',
                'totalFormations' => 4,
                'presentCount' => 4,
                'absentCount' => 0,
                'attendanceRate' => 100.0
            ],
            [
                'id' => 3,
                'name' => 'Mike Johnson',
                'email' => 'mike.johnson@formation.com',
                'team' => 'Marketing Team',
                'totalFormations' => 3,
                'presentCount' => 2,
                'absentCount' => 1,
                'attendanceRate' => 66.7
            ],
            [
                'id' => 4,
                'name' => 'Sarah Wilson',
                'email' => 'sarah.wilson@formation.com',
                'team' => 'Design Team',
                'totalFormations' => 2,
                'presentCount' => 2,
                'absentCount' => 0,
                'attendanceRate' => 100.0
            ],
            [
                'id' => 5,
                'name' => 'David Brown',
                'email' => 'david.brown@formation.com',
                'team' => 'Security Team',
                'totalFormations' => 4,
                'presentCount' => 3,
                'absentCount' => 1,
                'attendanceRate' => 75.0
            ]
        ]);
    });

    // Profile test routes
    Route::get('auth/me', function () {
        return response()->json([
            'id' => 1,
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@formation.com',
            'role' => 'admin',
            'phone' => '+33123456789',
            'specialite' => null,
            'status' => 'active',
            'team_id' => null,
            'created_at' => now()->toISOString(),
            'updated_at' => now()->toISOString()
        ]);
    });

    Route::get('employee/profile', function () {
        return response()->json([
            'id' => 2,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@formation.com',
            'role' => 'employe',
            'phone' => '+33123456790',
            'specialite' => null,
            'status' => 'active',
            'team_id' => 1,
            'created_at' => now()->toISOString(),
            'updated_at' => now()->toISOString()
        ]);
    });

    Route::get('trainer/profile', function () {
        return response()->json([
            'id' => 3,
            'first_name' => 'Syrine',
            'last_name' => 'Daik',
            'email' => 'trainer@formation.com',
            'role' => 'formateur',
            'phone' => '+33123456789',
            'specialite' => 'Angular & TypeScript',
            'status' => 'active',
            'team_id' => null,
            'created_at' => now()->toISOString(),
            'updated_at' => now()->toISOString()
        ]);
    });

    Route::get('auth/profile', function () {
        return response()->json([
            'success' => true,
            'data' => [
                'id' => 1,
                'first_name' => 'Admin',
                'last_name' => 'User',
                'email' => 'admin@formation.com',
                'role' => 'admin',
                'phone' => '+33123456789',
                'specialite' => null,
                'status' => 'active',
                'team_id' => null,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    });

    Route::get('employee/profile', function () {
        return response()->json([
            'success' => true,
            'data' => [
                'id' => 3,
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'employee@formation.com',
                'role' => 'employe',
                'phone' => '+33987654321',
                'specialite' => null,
                'status' => 'active',
                'team_id' => 1,
                'team' => [
                    'id' => 1,
                    'name' => 'Development Team',
                    'speciality' => 'Web Development'
                ],
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    });

    Route::get('trainer/profile', function () {
        return response()->json([
            'success' => true,
            'data' => [
                'id' => 2,
                'first_name' => 'Syrine',
                'last_name' => 'Daik',
                'email' => 'trainer@formation.com',
                'role' => 'formateur',
                'phone' => '+33123456789',
                'specialite' => 'Angular & TypeScript',
                'status' => 'active',
                'team_id' => null,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    });

    // Reports test routes
    Route::get('reports/attendance', function () {
        return response()->json([
            [
                'id' => 1,
                'employeeName' => 'John Doe',
                'email' => 'john.doe@formation.com',
                'team' => 'Development Team',
                'formationName' => 'Angular Advanced Concepts',
                'formationDate' => '2025-07-22T10:00:00',
                'trainer' => 'Syrine Daik',
                'status' => 'present',
                'attendanceRate' => 90.0
            ],
            [
                'id' => 2,
                'employeeName' => 'Jane Smith',
                'email' => 'jane.smith@formation.com',
                'team' => 'Data Science Team',
                'formationName' => 'Data Science with Python',
                'formationDate' => '2025-07-07T14:00:00',
                'trainer' => 'Marie Martin',
                'status' => 'present',
                'attendanceRate' => 80.0
            ],
            [
                'id' => 3,
                'employeeName' => 'Mike Johnson',
                'email' => 'mike.johnson@formation.com',
                'team' => 'Marketing Team',
                'formationName' => 'Project Management Essentials',
                'formationDate' => '2025-07-14T09:00:00',
                'trainer' => 'Pierre Dubois',
                'status' => 'absent',
                'attendanceRate' => 88.0
            ],
            [
                'id' => 4,
                'employeeName' => 'Sarah Wilson',
                'email' => 'sarah.wilson@formation.com',
                'team' => 'Design Team',
                'formationName' => 'UX/UI Design Principles',
                'formationDate' => '2025-07-20T11:00:00',
                'trainer' => 'Alice Moreau',
                'status' => 'present',
                'attendanceRate' => 95.0
            ],
            [
                'id' => 5,
                'employeeName' => 'David Brown',
                'email' => 'david.brown@formation.com',
                'team' => 'Security Team',
                'formationName' => 'Cybersecurity Fundamentals',
                'formationDate' => '2025-07-23T13:00:00',
                'trainer' => 'Thomas Bernard',
                'status' => 'present',
                'attendanceRate' => 94.0
            ]
        ]);
    });

    Route::get('reports/formations', function () {
        return response()->json([
            'success' => true,
            'data' => [
                'total_formations' => 13,
                'by_status' => [
                    'completed' => 5,
                    'scheduled' => 7,
                    'cancelled' => 1
                ],
                'by_specialty' => [
                    'Angular & TypeScript' => 3,
                    'Data Science' => 2,
                    'Project Management' => 2,
                    'Digital Marketing' => 1,
                    'Cybersecurity' => 2,
                    'UX/UI Design' => 1,
                    'Cloud Computing' => 1,
                    'Business Analysis' => 1
                ],
                'monthly_distribution' => [
                    'July 2025' => 5,
                    'August 2025' => 8
                ]
            ]
        ]);
    });

    Route::get('reports/teams', function () {
        return response()->json([
            'success' => true,
            'data' => [
                [
                    'id' => 1,
                    'name' => 'Development Team',
                    'speciality' => 'Web Development',
                    'totalEmployees' => 5,
                    'totalFormations' => 8,
                    'completedFormations' => 3,
                    'averageAttendanceRate' => 88.5,
                    'upcomingFormations' => 4
                ],
                [
                    'id' => 2,
                    'name' => 'Data Science Team',
                    'speciality' => 'Data Analysis',
                    'totalEmployees' => 4,
                    'totalFormations' => 5,
                    'completedFormations' => 2,
                    'averageAttendanceRate' => 92.0,
                    'upcomingFormations' => 3
                ],
                [
                    'id' => 3,
                    'name' => 'Marketing Team',
                    'speciality' => 'Digital Marketing',
                    'totalEmployees' => 3,
                    'totalFormations' => 3,
                    'completedFormations' => 1,
                    'averageAttendanceRate' => 85.0,
                    'upcomingFormations' => 2
                ],
                [
                    'id' => 4,
                    'name' => 'Design Team',
                    'speciality' => 'UX/UI Design',
                    'totalEmployees' => 2,
                    'totalFormations' => 2,
                    'completedFormations' => 1,
                    'averageAttendanceRate' => 90.0,
                    'upcomingFormations' => 1
                ],
                [
                    'id' => 5,
                    'name' => 'Security Team',
                    'speciality' => 'Cybersecurity',
                    'totalEmployees' => 3,
                    'totalFormations' => 4,
                    'completedFormations' => 2,
                    'averageAttendanceRate' => 87.5,
                    'upcomingFormations' => 2
                ]
            ]
        ]);
    });

    Route::get('reports/formations', function () {
        return response()->json([
            [
                'id' => 1,
                'name' => 'Angular Advanced Concepts',
                'date' => '2025-07-22T10:00:00',
                'trainer' => 'Syrine Daik',
                'team' => 'Development Team',
                'duration' => 8,
                'room' => 'Room A',
                'status' => 'completed',
                'participantsCount' => 10,
                'attendanceRate' => 90.0
            ],
            [
                'id' => 2,
                'name' => 'Data Science with Python',
                'date' => '2025-07-07T14:00:00',
                'trainer' => 'Marie Martin',
                'team' => 'Data Science Team',
                'duration' => 8,
                'room' => 'Room H',
                'status' => 'completed',
                'participantsCount' => 15,
                'attendanceRate' => 80.0
            ],
            [
                'id' => 3,
                'name' => 'Project Management Essentials',
                'date' => '2025-07-14T09:00:00',
                'trainer' => 'Pierre Dubois',
                'team' => 'Marketing Team',
                'duration' => 6,
                'room' => 'Room C',
                'status' => 'completed',
                'participantsCount' => 25,
                'attendanceRate' => 88.0
            ],
            [
                'id' => 4,
                'name' => 'Digital Marketing Strategy',
                'date' => '2025-07-17T11:00:00',
                'trainer' => 'Sophie Laurent',
                'team' => 'Marketing Team',
                'duration' => 4,
                'room' => 'Room D',
                'status' => 'upcoming',
                'participantsCount' => 22,
                'attendanceRate' => 0
            ],
            [
                'id' => 5,
                'name' => 'Cybersecurity Fundamentals',
                'date' => '2025-07-23T13:00:00',
                'trainer' => 'Thomas Bernard',
                'team' => 'Security Team',
                'duration' => 6,
                'room' => 'Room E',
                'status' => 'upcoming',
                'participantsCount' => 18,
                'attendanceRate' => 0
            ]
        ]);
    });

    Route::get('reports/teams', function () {
        return response()->json([
            [
                'id' => 1,
                'name' => 'Development Team',
                'speciality' => 'Web Development',
                'totalEmployees' => 5,
                'totalFormations' => 8,
                'completedFormations' => 3,
                'upcomingFormations' => 5,
                'averageAttendanceRate' => 88.5,
                'lastFormationDate' => '2025-07-22T10:00:00'
            ],
            [
                'id' => 2,
                'name' => 'Data Science Team',
                'speciality' => 'Data Analysis',
                'totalEmployees' => 4,
                'totalFormations' => 5,
                'completedFormations' => 2,
                'upcomingFormations' => 3,
                'averageAttendanceRate' => 92.0,
                'lastFormationDate' => '2025-07-07T14:00:00'
            ],
            [
                'id' => 3,
                'name' => 'Marketing Team',
                'speciality' => 'Digital Marketing',
                'totalEmployees' => 3,
                'totalFormations' => 3,
                'completedFormations' => 1,
                'upcomingFormations' => 2,
                'averageAttendanceRate' => 85.0,
                'lastFormationDate' => '2025-07-14T09:00:00'
            ],
            [
                'id' => 4,
                'name' => 'Design Team',
                'speciality' => 'UX/UI Design',
                'totalEmployees' => 2,
                'totalFormations' => 2,
                'completedFormations' => 1,
                'upcomingFormations' => 1,
                'averageAttendanceRate' => 90.0,
                'lastFormationDate' => '2025-07-20T11:00:00'
            ],
            [
                'id' => 5,
                'name' => 'Security Team',
                'speciality' => 'Cybersecurity',
                'totalEmployees' => 3,
                'totalFormations' => 4,
                'completedFormations' => 1,
                'upcomingFormations' => 3,
                'averageAttendanceRate' => 87.5,
                'lastFormationDate' => '2025-07-23T13:00:00'
            ]
        ]);
    });

    // Test trainer profile routes (without authentication for testing)
    Route::prefix('trainer')->group(function () {
        Route::post('change-password', [App\Http\Controllers\Api\TrainerProfileController::class, 'changePassword']);
        Route::get('profile', [App\Http\Controllers\Api\TrainerProfileController::class, 'getProfile']);
        Route::put('profile', [App\Http\Controllers\Api\TrainerProfileController::class, 'updateProfile']);
    });

    // User management routes (for testing without auth)
    Route::prefix('admin/users')->group(function () {
        Route::get('/', [App\Http\Controllers\Api\UserManagementController::class, 'index']);
        Route::post('/', [App\Http\Controllers\Api\UserManagementController::class, 'store']);
        Route::put('{id}', [App\Http\Controllers\Api\UserManagementController::class, 'update']);
        Route::delete('{id}', [App\Http\Controllers\Api\UserManagementController::class, 'destroy']);
        Route::post('{id}/reset-password', [App\Http\Controllers\Api\UserManagementController::class, 'resetPassword']);
        Route::get('statistics', [App\Http\Controllers\Api\UserManagementController::class, 'statistics']);
    });

    // Mock users data for testing
    Route::get('admin/users', function () {
        return response()->json([
            'success' => true,
            'data' => [
                [
                    'id' => 1,
                    'first_name' => 'System',
                    'last_name' => 'Administrator',
                    'email' => 'admin@formation.com',
                    'role' => 'admin',
                    'status' => 'active',
                    'phone' => '+33123456789',
                    'specialite' => null,
                    'team' => null,
                    'created_at' => now()->toISOString(),
                    'last_login_at' => now()->subHours(2)->toISOString()
                ]
            ]
        ]);
    });
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

    // Routes spécifiques aux formateurs
    Route::prefix('trainer')->middleware('keycloak:formateur')->group(function () {
        // Profile management
        Route::get('profile', [App\Http\Controllers\Api\TrainerProfileController::class, 'getProfile']);
        Route::put('profile', [App\Http\Controllers\Api\TrainerProfileController::class, 'updateProfile']);
        Route::post('change-password', [App\Http\Controllers\Api\TrainerProfileController::class, 'changePassword']);

        Route::get('stats', [App\Http\Controllers\TrainerController::class, 'getStats']);
        Route::get('formations', [App\Http\Controllers\TrainerController::class, 'getMyFormations']);
        Route::get('formations/upcoming', [App\Http\Controllers\TrainerController::class, 'getUpcomingFormations']);
        Route::get('formations/completed', [App\Http\Controllers\TrainerController::class, 'getCompletedFormations']);
        Route::get('formations/{id}', [App\Http\Controllers\TrainerController::class, 'getFormationDetails']);
        Route::put('formations/{id}', [App\Http\Controllers\TrainerController::class, 'updateFormationDetails']);

        // Gestion des participants et présences
        Route::get('formations/{id}/participants', [App\Http\Controllers\TrainerController::class, 'getFormationParticipants']);
        Route::put('formations/{formationId}/participants/{participantId}/attendance', [App\Http\Controllers\TrainerController::class, 'updateParticipantAttendance']);
        Route::post('formations/{id}/attendance', [App\Http\Controllers\TrainerController::class, 'submitAttendance']);
        Route::get('attendance/history', [App\Http\Controllers\TrainerController::class, 'getAttendanceHistory']);

        // Rapports et bilans
        Route::post('formations/{id}/report', [App\Http\Controllers\TrainerController::class, 'createFormationReport']);
        Route::get('reports', [App\Http\Controllers\TrainerController::class, 'getMyReports']);

        // Documents
        Route::post('formations/{id}/documents', [App\Http\Controllers\TrainerController::class, 'uploadFormationDocument']);
        Route::get('formations/{id}/documents', [App\Http\Controllers\TrainerController::class, 'getFormationDocuments']);
        Route::get('documents', [App\Http\Controllers\TrainerController::class, 'getMyDocuments']);
        Route::delete('documents/{id}', [App\Http\Controllers\TrainerController::class, 'deleteDocument']);
    });

    // Routes spécifiques aux employés
    Route::prefix('employee')->middleware('keycloak:employe')->group(function () {
        // Dashboard et statistiques
        Route::get('stats', [App\Http\Controllers\EmployeeController::class, 'getStats']);
        Route::get('profile', [App\Http\Controllers\EmployeeController::class, 'getProfile']);

        // Accès aux formations
        Route::get('formations', [App\Http\Controllers\EmployeeController::class, 'getMyFormations']);
        Route::get('formations/{id}', [App\Http\Controllers\EmployeeController::class, 'getFormationDetails']);

        // Historique des formations
        Route::get('history', [App\Http\Controllers\EmployeeController::class, 'getFormationHistory']);

        // Accès aux documents
        Route::get('formations/{id}/documents', [App\Http\Controllers\EmployeeController::class, 'getFormationDocuments']);
        Route::get('formations/{formationId}/documents/{documentId}/download', [App\Http\Controllers\EmployeeController::class, 'downloadDocument']);
    });

});
