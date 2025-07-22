<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Formation;
use App\Models\FormationParticipant;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TrainerController extends Controller
{
    /**
     * Get trainer dashboard statistics
     */
    public function getStats()
    {
        try {
            $trainerId = Auth::id();
            
            // Get formations count
            $totalFormations = Formation::where('formateur_id', $trainerId)->count();
            $upcomingFormations = Formation::where('formateur_id', $trainerId)
                ->where('date', '>', now())
                ->count();
            $completedFormations = Formation::where('formateur_id', $trainerId)
                ->where('date', '<=', now())
                ->count();
            
            // Get total participants
            $totalParticipants = FormationParticipant::whereIn('formation_id', 
                Formation::where('formateur_id', $trainerId)->pluck('id')
            )->count();
            
            // Calculate average attendance rate (mock for now)
            $averageAttendanceRate = 87; // This should be calculated from actual attendance data
            
            // Get this month formations
            $thisMonthFormations = Formation::where('formateur_id', $trainerId)
                ->whereMonth('date', now()->month)
                ->whereYear('date', now()->year)
                ->count();
            
            return response()->json([
                'totalFormations' => $totalFormations,
                'upcomingFormations' => $upcomingFormations,
                'completedFormations' => $completedFormations,
                'totalParticipants' => $totalParticipants,
                'averageAttendanceRate' => $averageAttendanceRate,
                'thisMonthFormations' => $thisMonthFormations
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get trainer stats'], 500);
        }
    }

    /**
     * Get all formations assigned to current trainer
     */
    public function getMyFormations()
    {
        try {
            $trainerId = Auth::id();
            
            $formations = Formation::with(['equipe', 'participants.user'])
                ->where('formateur_id', $trainerId)
                ->orderBy('date', 'desc')
                ->get();
            
            // Add computed fields
            $formations->each(function ($formation) {
                $formation->participantCount = $formation->participants->count();
                $formation->attendanceRate = $this->calculateAttendanceRate($formation);
                $formation->status = $this->getFormationStatus($formation);
            });
            
            return response()->json($formations);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get formations'], 500);
        }
    }

    /**
     * Get upcoming formations for trainer
     */
    public function getUpcomingFormations()
    {
        try {
            $trainerId = Auth::id();
            
            $formations = Formation::with(['equipe', 'participants.user'])
                ->where('formateur_id', $trainerId)
                ->where('date', '>', now())
                ->orderBy('date', 'asc')
                ->get();
            
            // Add computed fields
            $formations->each(function ($formation) {
                $formation->participantCount = $formation->participants->count();
                $formation->attendanceRate = 0; // Upcoming formations don't have attendance yet
                $formation->status = 'upcoming';
            });
            
            return response()->json($formations);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get upcoming formations'], 500);
        }
    }

    /**
     * Get completed formations for trainer
     */
    public function getCompletedFormations()
    {
        try {
            $trainerId = Auth::id();
            
            $formations = Formation::with(['equipe', 'participants.user'])
                ->where('formateur_id', $trainerId)
                ->where('date', '<=', now())
                ->orderBy('date', 'desc')
                ->get();
            
            // Add computed fields
            $formations->each(function ($formation) {
                $formation->participantCount = $formation->participants->count();
                $formation->attendanceRate = $this->calculateAttendanceRate($formation);
                $formation->status = 'completed';
            });
            
            return response()->json($formations);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get completed formations'], 500);
        }
    }

    /**
     * Get formation details with participants
     */
    public function getFormationDetails($id)
    {
        try {
            $trainerId = Auth::id();
            
            $formation = Formation::with(['equipe', 'formateur', 'participants.user.team'])
                ->where('id', $id)
                ->where('formateur_id', $trainerId)
                ->first();
            
            if (!$formation) {
                return response()->json(['error' => 'Formation not found'], 404);
            }
            
            return response()->json($formation);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get formation details'], 500);
        }
    }

    /**
     * Update formation details (limited fields for trainer)
     */
    public function updateFormationDetails(Request $request, $id)
    {
        try {
            $trainerId = Auth::id();
            
            $formation = Formation::where('id', $id)
                ->where('formateur_id', $trainerId)
                ->first();
            
            if (!$formation) {
                return response()->json(['error' => 'Formation not found'], 404);
            }
            
            // Trainers can only update certain fields
            $allowedFields = ['description', 'room'];
            $updateData = $request->only($allowedFields);
            
            $formation->update($updateData);
            
            return response()->json($formation);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update formation'], 500);
        }
    }

    /**
     * Get participants for a formation
     */
    public function getFormationParticipants($id)
    {
        try {
            $trainerId = Auth::id();
            
            // Verify trainer owns this formation
            $formation = Formation::where('id', $id)
                ->where('formateur_id', $trainerId)
                ->first();
            
            if (!$formation) {
                return response()->json(['error' => 'Formation not found'], 404);
            }
            
            $participants = FormationParticipant::with(['user.team'])
                ->where('formation_id', $id)
                ->get();
            
            return response()->json($participants);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get participants'], 500);
        }
    }

    /**
     * Update participant attendance
     */
    public function updateParticipantAttendance(Request $request, $formationId, $participantId)
    {
        try {
            $trainerId = Auth::id();
            
            // Verify trainer owns this formation
            $formation = Formation::where('id', $formationId)
                ->where('formateur_id', $trainerId)
                ->first();
            
            if (!$formation) {
                return response()->json(['error' => 'Formation not found'], 404);
            }
            
            $participant = FormationParticipant::where('formation_id', $formationId)
                ->where('user_id', $participantId)
                ->first();
            
            if (!$participant) {
                return response()->json(['error' => 'Participant not found'], 404);
            }
            
            $participant->update([
                'attendance' => $request->attendance
            ]);
            
            return response()->json($participant);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update attendance'], 500);
        }
    }

    /**
     * Submit attendance for entire formation
     */
    public function submitAttendance(Request $request, $id)
    {
        try {
            $trainerId = Auth::id();
            
            // Verify trainer owns this formation
            $formation = Formation::where('id', $id)
                ->where('formateur_id', $trainerId)
                ->first();
            
            if (!$formation) {
                return response()->json(['error' => 'Formation not found'], 404);
            }
            
            $attendanceData = $request->attendance;
            
            foreach ($attendanceData as $attendance) {
                FormationParticipant::where('formation_id', $id)
                    ->where('user_id', $attendance['user_id'])
                    ->update(['attendance' => $attendance['attendance']]);
            }
            
            return response()->json(['message' => 'Attendance submitted successfully']);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to submit attendance'], 500);
        }
    }

    /**
     * Calculate attendance rate for a formation
     */
    private function calculateAttendanceRate($formation)
    {
        $totalParticipants = $formation->participants->count();
        if ($totalParticipants === 0) return 0;
        
        $presentCount = $formation->participants->where('attendance', 'present')->count();
        return round(($presentCount / $totalParticipants) * 100);
    }

    /**
     * Get attendance history for trainer
     */
    public function getAttendanceHistory()
    {
        try {
            $trainerId = Auth::id();

            $attendanceHistory = Formation::with(['participants'])
                ->where('formateur_id', $trainerId)
                ->where('date', '<=', now())
                ->orderBy('date', 'desc')
                ->get()
                ->map(function ($formation) {
                    $totalParticipants = $formation->participants->count();
                    $presentCount = $formation->participants->where('attendance', 'present')->count();
                    $absentCount = $formation->participants->where('attendance', 'absent')->count();
                    $attendanceRate = $totalParticipants > 0 ? round(($presentCount / $totalParticipants) * 100) : 0;

                    return [
                        'id' => $formation->id,
                        'formation_name' => $formation->name,
                        'date' => $formation->date,
                        'total_participants' => $totalParticipants,
                        'present_count' => $presentCount,
                        'absent_count' => $absentCount,
                        'attendance_rate' => $attendanceRate
                    ];
                });

            return response()->json($attendanceHistory);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get attendance history'], 500);
        }
    }

    /**
     * Create formation report/feedback
     */
    public function createFormationReport(Request $request, $id)
    {
        try {
            $trainerId = Auth::id();

            // Verify trainer owns this formation
            $formation = Formation::where('id', $id)
                ->where('formateur_id', $trainerId)
                ->first();

            if (!$formation) {
                return response()->json(['error' => 'Formation not found'], 404);
            }

            // Create report (you might want to create a FormationReport model)
            $reportData = [
                'formation_id' => $id,
                'trainer_id' => $trainerId,
                'overall_rating' => $request->overall_rating,
                'objectives_achieved' => $request->objectives_achieved,
                'difficulties_encountered' => $request->difficulties_encountered,
                'suggestions_for_improvement' => $request->suggestions_for_improvement,
                'created_at' => now(),
                'updated_at' => now()
            ];

            // For now, just return success (implement actual storage later)
            return response()->json([
                'message' => 'Formation report created successfully',
                'report' => $reportData
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create formation report'], 500);
        }
    }

    /**
     * Get formation reports created by trainer
     */
    public function getMyReports()
    {
        try {
            $trainerId = Auth::id();

            // Mock data for now (implement actual model later)
            $reports = [
                [
                    'id' => 1,
                    'formation_name' => 'React Fundamentals',
                    'date' => '2024-01-15',
                    'overall_rating' => 4,
                    'objectives_achieved' => 'All objectives were met successfully.',
                    'difficulties_encountered' => 'Some participants struggled with JSX syntax.',
                    'suggestions_for_improvement' => 'Add more hands-on exercises.',
                    'status' => 'submitted'
                ]
            ];

            return response()->json($reports);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get reports'], 500);
        }
    }

    /**
     * Upload document for formation
     */
    public function uploadFormationDocument(Request $request, $id)
    {
        try {
            $trainerId = Auth::id();

            // Verify trainer owns this formation
            $formation = Formation::where('id', $id)
                ->where('formateur_id', $trainerId)
                ->first();

            if (!$formation) {
                return response()->json(['error' => 'Formation not found'], 404);
            }

            // Handle file upload (implement actual file storage later)
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $metadata = json_decode($request->metadata, true);

                // Mock response for now
                return response()->json([
                    'message' => 'Document uploaded successfully',
                    'document' => [
                        'id' => rand(1, 1000),
                        'name' => $file->getClientOriginalName(),
                        'size' => $file->getSize(),
                        'type' => $file->getClientOriginalExtension(),
                        'formation_id' => $id,
                        'uploaded_at' => now()
                    ]
                ]);
            }

            return response()->json(['error' => 'No file provided'], 400);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to upload document'], 500);
        }
    }

    /**
     * Get documents for a formation
     */
    public function getFormationDocuments($id)
    {
        try {
            $trainerId = Auth::id();

            // Verify trainer owns this formation
            $formation = Formation::where('id', $id)
                ->where('formateur_id', $trainerId)
                ->first();

            if (!$formation) {
                return response()->json(['error' => 'Formation not found'], 404);
            }

            // Mock data for now
            $documents = [
                [
                    'id' => 1,
                    'name' => 'Formation_Slides.pdf',
                    'type' => 'pdf',
                    'size' => '2.5 MB',
                    'uploaded_at' => '2024-01-20'
                ]
            ];

            return response()->json($documents);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get formation documents'], 500);
        }
    }

    /**
     * Get all documents uploaded by trainer
     */
    public function getMyDocuments()
    {
        try {
            $trainerId = Auth::id();

            // Mock data for now
            $documents = [
                [
                    'id' => 1,
                    'name' => 'Angular_Advanced_Slides.pdf',
                    'type' => 'PDF',
                    'size' => '2.5 MB',
                    'formation' => 'Angular Advanced Concepts',
                    'upload_date' => '2024-01-20',
                    'status' => 'active'
                ]
            ];

            return response()->json($documents);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get documents'], 500);
        }
    }

    /**
     * Delete document
     */
    public function deleteDocument($id)
    {
        try {
            $trainerId = Auth::id();

            // Mock implementation for now
            return response()->json(['message' => 'Document deleted successfully']);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete document'], 500);
        }
    }



    /**
     * Get formation status based on date
     */
    private function getFormationStatus($formation)
    {
        $formationDate = \Carbon\Carbon::parse($formation->date);
        $now = \Carbon\Carbon::now();

        if ($formationDate->isFuture()) {
            return 'upcoming';
        } elseif ($formationDate->isToday()) {
            return 'ongoing';
        } else {
            return 'completed';
        }
    }
}
