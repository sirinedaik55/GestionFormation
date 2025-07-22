<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Formation;
use App\Models\FormationParticipant;
use App\Models\User;
use Carbon\Carbon;

class EmployeeController extends Controller
{
    /**
     * Get employee dashboard statistics
     */
    public function getStats()
    {
        try {
            $employeeId = Auth::id();
            
            // Get employee with team info
            $employee = User::with('team')->find($employeeId);
            
            if (!$employee) {
                return response()->json(['error' => 'Employee not found'], 404);
            }
            
            // Get all formations for this employee
            $allFormations = FormationParticipant::where('user_id', $employeeId)
                ->with(['formation'])
                ->get();
            
            // Calculate statistics
            $totalFormations = $allFormations->count();
            $completedFormations = $allFormations->where('formation.date', '<=', now())->count();
            $upcomingFormations = $allFormations->where('formation.date', '>', now())->count();
            $presentCount = $allFormations->where('attendance', 'present')->count();
            $absentCount = $allFormations->where('attendance', 'absent')->count();
            
            // Calculate attendance rate
            $attendanceRate = $completedFormations > 0 ? round(($presentCount / $completedFormations) * 100) : 0;
            
            // Get recent formations
            $recentFormations = $allFormations->sortByDesc('formation.date')->take(5);
            
            // Get upcoming formations
            $upcomingFormationsList = $allFormations
                ->where('formation.date', '>', now())
                ->sortBy('formation.date')
                ->take(3);
            
            $stats = [
                'employee_info' => [
                    'name' => $employee->first_name . ' ' . $employee->last_name,
                    'email' => $employee->email,
                    'team' => $employee->team ? $employee->team->name : 'No team assigned',
                    'team_speciality' => $employee->team ? $employee->team->speciality : null
                ],
                'formation_stats' => [
                    'total_formations' => $totalFormations,
                    'completed_formations' => $completedFormations,
                    'upcoming_formations' => $upcomingFormations,
                    'attendance_rate' => $attendanceRate,
                    'present_count' => $presentCount,
                    'absent_count' => $absentCount
                ],
                'recent_formations' => $recentFormations->map(function ($participant) {
                    return [
                        'id' => $participant->formation->id,
                        'name' => $participant->formation->name,
                        'date' => $participant->formation->date,
                        'status' => $this->getFormationStatus($participant->formation),
                        'attendance' => $participant->attendance,
                        'trainer' => $participant->formation->formateur ? 
                            $participant->formation->formateur->first_name . ' ' . $participant->formation->formateur->last_name : 
                            'TBD'
                    ];
                }),
                'upcoming_formations' => $upcomingFormationsList->map(function ($participant) {
                    return [
                        'id' => $participant->formation->id,
                        'name' => $participant->formation->name,
                        'date' => $participant->formation->date,
                        'duree' => $participant->formation->duree,
                        'room' => $participant->formation->room,
                        'trainer' => $participant->formation->formateur ? 
                            $participant->formation->formateur->first_name . ' ' . $participant->formation->formateur->last_name : 
                            'TBD'
                    ];
                })
            ];
            
            return response()->json($stats);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get employee stats'], 500);
        }
    }

    /**
     * Get employee's assigned formations
     */
    public function getMyFormations(Request $request)
    {
        try {
            $employeeId = Auth::id();
            $status = $request->query('status', 'all'); // all, upcoming, completed
            
            $query = FormationParticipant::where('user_id', $employeeId)
                ->with(['formation.formateur', 'formation.team']);
            
            // Filter by status
            if ($status === 'upcoming') {
                $query->whereHas('formation', function ($q) {
                    $q->where('date', '>', now());
                });
            } elseif ($status === 'completed') {
                $query->whereHas('formation', function ($q) {
                    $q->where('date', '<=', now());
                });
            }
            
            $participants = $query->get();
            
            $formations = $participants->map(function ($participant) {
                $formation = $participant->formation;
                return [
                    'id' => $formation->id,
                    'name' => $formation->name,
                    'description' => $formation->description,
                    'date' => $formation->date,
                    'duree' => $formation->duree,
                    'room' => $formation->room,
                    'status' => $this->getFormationStatus($formation),
                    'attendance' => $participant->attendance,
                    'participation_status' => $participant->status,
                    'trainer' => $formation->formateur ? [
                        'id' => $formation->formateur->id,
                        'name' => $formation->formateur->first_name . ' ' . $formation->formateur->last_name,
                        'email' => $formation->formateur->email
                    ] : null,
                    'team' => $formation->team ? [
                        'id' => $formation->team->id,
                        'name' => $formation->team->name,
                        'speciality' => $formation->team->speciality
                    ] : null
                ];
            });
            
            return response()->json($formations);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get formations'], 500);
        }
    }

    /**
     * Get formation details for employee
     */
    public function getFormationDetails($id)
    {
        try {
            $employeeId = Auth::id();
            
            // Check if employee is assigned to this formation
            $participant = FormationParticipant::where('user_id', $employeeId)
                ->where('formation_id', $id)
                ->with(['formation.formateur', 'formation.team'])
                ->first();
            
            if (!$participant) {
                return response()->json(['error' => 'Formation not found or not assigned'], 404);
            }
            
            $formation = $participant->formation;
            
            $formationDetails = [
                'id' => $formation->id,
                'name' => $formation->name,
                'description' => $formation->description,
                'date' => $formation->date,
                'duree' => $formation->duree,
                'room' => $formation->room,
                'status' => $this->getFormationStatus($formation),
                'attendance' => $participant->attendance,
                'participation_status' => $participant->status,
                'trainer' => $formation->formateur ? [
                    'id' => $formation->formateur->id,
                    'name' => $formation->formateur->first_name . ' ' . $formation->formateur->last_name,
                    'email' => $formation->formateur->email,
                    'specialite' => $formation->formateur->specialite
                ] : null,
                'team' => $formation->team ? [
                    'id' => $formation->team->id,
                    'name' => $formation->team->name,
                    'speciality' => $formation->team->speciality
                ] : null,
                'documents' => $this->getFormationDocuments($id),
                'can_download_documents' => $this->getFormationStatus($formation) === 'completed' || 
                                          $this->getFormationStatus($formation) === 'ongoing'
            ];
            
            return response()->json($formationDetails);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get formation details'], 500);
        }
    }

    /**
     * Get employee's formation history with filters
     */
    public function getFormationHistory(Request $request)
    {
        try {
            $employeeId = Auth::id();
            $year = $request->query('year');
            $month = $request->query('month');
            
            $query = FormationParticipant::where('user_id', $employeeId)
                ->with(['formation.formateur'])
                ->whereHas('formation', function ($q) {
                    $q->where('date', '<=', now());
                });
            
            // Filter by year
            if ($year) {
                $query->whereHas('formation', function ($q) use ($year) {
                    $q->whereYear('date', $year);
                });
            }
            
            // Filter by month
            if ($month) {
                $query->whereHas('formation', function ($q) use ($month) {
                    $q->whereMonth('date', $month);
                });
            }
            
            $participants = $query->orderBy('created_at', 'desc')->get();
            
            $history = $participants->map(function ($participant) {
                $formation = $participant->formation;
                return [
                    'id' => $formation->id,
                    'name' => $formation->name,
                    'date' => $formation->date,
                    'duree' => $formation->duree,
                    'attendance' => $participant->attendance,
                    'trainer' => $formation->formateur ? 
                        $formation->formateur->first_name . ' ' . $formation->formateur->last_name : 
                        'TBD',
                    'completion_date' => $formation->date,
                    'has_documents' => $this->hasFormationDocuments($formation->id)
                ];
            });
            
            return response()->json($history);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get formation history'], 500);
        }
    }

    /**
     * Get documents for a formation (employee can only access if assigned)
     */
    public function getFormationDocuments($formationId)
    {
        try {
            $employeeId = Auth::id();
            
            // Check if employee is assigned to this formation
            $participant = FormationParticipant::where('user_id', $employeeId)
                ->where('formation_id', $formationId)
                ->first();
            
            if (!$participant) {
                return response()->json(['error' => 'Access denied'], 403);
            }
            
            // Mock documents for now (implement actual document storage later)
            $documents = [
                [
                    'id' => 1,
                    'name' => 'Formation_Slides.pdf',
                    'type' => 'pdf',
                    'size' => '2.5 MB',
                    'uploaded_at' => '2024-01-20',
                    'download_url' => '/api/employee/formations/' . $formationId . '/documents/1/download'
                ],
                [
                    'id' => 2,
                    'name' => 'Exercises.zip',
                    'type' => 'zip',
                    'size' => '1.8 MB',
                    'uploaded_at' => '2024-01-20',
                    'download_url' => '/api/employee/formations/' . $formationId . '/documents/2/download'
                ]
            ];
            
            return response()->json($documents);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get formation documents'], 500);
        }
    }

    /**
     * Download formation document
     */
    public function downloadDocument($formationId, $documentId)
    {
        try {
            $employeeId = Auth::id();
            
            // Check if employee is assigned to this formation
            $participant = FormationParticipant::where('user_id', $employeeId)
                ->where('formation_id', $formationId)
                ->first();
            
            if (!$participant) {
                return response()->json(['error' => 'Access denied'], 403);
            }
            
            // Mock download response (implement actual file serving later)
            return response()->json([
                'message' => 'Document download initiated',
                'document_id' => $documentId,
                'formation_id' => $formationId
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to download document'], 500);
        }
    }

    /**
     * Get employee profile information
     */
    public function getProfile()
    {
        try {
            $employee = User::with('team')->find(Auth::id());
            
            if (!$employee) {
                return response()->json(['error' => 'Employee not found'], 404);
            }
            
            $profile = [
                'id' => $employee->id,
                'first_name' => $employee->first_name,
                'last_name' => $employee->last_name,
                'email' => $employee->email,
                'phone' => $employee->phone,
                'role' => $employee->role,
                'status' => $employee->status,
                'team' => $employee->team ? [
                    'id' => $employee->team->id,
                    'name' => $employee->team->name,
                    'speciality' => $employee->team->speciality
                ] : null,
                'created_at' => $employee->created_at,
                'last_login' => $employee->last_login_at
            ];
            
            return response()->json($profile);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get profile'], 500);
        }
    }

    /**
     * Helper methods
     */
    private function getFormationStatus($formation)
    {
        $formationDate = Carbon::parse($formation->date);
        $now = Carbon::now();
        
        if ($formationDate->isFuture()) {
            return 'upcoming';
        } elseif ($formationDate->isToday()) {
            return 'ongoing';
        } else {
            return 'completed';
        }
    }

    private function hasFormationDocuments($formationId)
    {
        // Mock implementation - return true for demo
        return true;
    }
}
