<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use App\Models\FormationParticipant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Get participants for a formation (for trainers)
     */
    public function getFormationParticipants($formationId)
    {
        $user = Auth::user();
        
        // Check if user is trainer and assigned to this formation
        $formation = Formation::where('id', $formationId)
            ->where('formateur_id', $user->id)
            ->first();
            
        if (!$formation) {
            return response()->json([
                'success' => false,
                'message' => 'Formation not found or not assigned to you'
            ], 404);
        }

        $participants = FormationParticipant::with(['user.team'])
            ->where('formation_id', $formationId)
            ->get()
            ->map(function ($participant) {
                return [
                    'id' => $participant->id,
                    'user_id' => $participant->user_id,
                    'first_name' => $participant->user->first_name,
                    'last_name' => $participant->user->last_name,
                    'email' => $participant->user->email,
                    'team' => $participant->user->team ? $participant->user->team->name : null,
                    'status' => $participant->status,
                    'notes' => $participant->notes,
                    'attendance_marked_at' => $participant->updated_at
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'formation' => [
                    'id' => $formation->id,
                    'title' => $formation->title,
                    'date_debut' => $formation->date_debut,
                    'date_fin' => $formation->date_fin,
                    'lieu' => $formation->lieu
                ],
                'participants' => $participants
            ]
        ]);
    }

    /**
     * Mark attendance for a single participant
     */
    public function markAttendance(Request $request, $formationId, $participantId)
    {
        $user = Auth::user();
        
        // Check if user is trainer
        if ($user->role !== 'formateur') {
            return response()->json([
                'success' => false,
                'message' => 'Only trainers can mark attendance'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:present,absent',
            'notes' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if formation belongs to trainer
        $formation = Formation::where('id', $formationId)
            ->where('formateur_id', $user->id)
            ->first();
            
        if (!$formation) {
            return response()->json([
                'success' => false,
                'message' => 'Formation not found or not assigned to you'
            ], 404);
        }

        // Find participant
        $participant = FormationParticipant::where('id', $participantId)
            ->where('formation_id', $formationId)
            ->first();
            
        if (!$participant) {
            return response()->json([
                'success' => false,
                'message' => 'Participant not found'
            ], 404);
        }

        // Update attendance
        $participant->update([
            'status' => $request->status,
            'notes' => $request->notes
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Attendance marked successfully',
            'data' => [
                'participant_id' => $participant->id,
                'status' => $participant->status,
                'notes' => $participant->notes,
                'updated_at' => $participant->updated_at
            ]
        ]);
    }

    /**
     * Submit attendance for entire formation
     */
    public function submitAttendance(Request $request, $formationId)
    {
        $user = Auth::user();
        
        // Check if user is trainer
        if ($user->role !== 'formateur') {
            return response()->json([
                'success' => false,
                'message' => 'Only trainers can submit attendance'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'attendance' => 'required|array',
            'attendance.*.participant_id' => 'required|integer|exists:formation_participants,id',
            'attendance.*.status' => 'required|in:present,absent',
            'attendance.*.notes' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if formation belongs to trainer
        $formation = Formation::where('id', $formationId)
            ->where('formateur_id', $user->id)
            ->first();
            
        if (!$formation) {
            return response()->json([
                'success' => false,
                'message' => 'Formation not found or not assigned to you'
            ], 404);
        }

        $updatedCount = 0;
        $errors = [];

        foreach ($request->attendance as $attendanceData) {
            try {
                $participant = FormationParticipant::where('id', $attendanceData['participant_id'])
                    ->where('formation_id', $formationId)
                    ->first();
                    
                if ($participant) {
                    $participant->update([
                        'status' => $attendanceData['status'],
                        'notes' => $attendanceData['notes'] ?? null
                    ]);
                    $updatedCount++;
                } else {
                    $errors[] = "Participant {$attendanceData['participant_id']} not found";
                }
            } catch (\Exception $e) {
                $errors[] = "Error updating participant {$attendanceData['participant_id']}: " . $e->getMessage();
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Attendance submitted successfully. Updated {$updatedCount} participants.",
            'data' => [
                'updated_count' => $updatedCount,
                'errors' => $errors
            ]
        ]);
    }

    /**
     * Get attendance history for a trainer
     */
    public function getAttendanceHistory()
    {
        $user = Auth::user();
        
        if ($user->role !== 'formateur') {
            return response()->json([
                'success' => false,
                'message' => 'Only trainers can view attendance history'
            ], 403);
        }

        $formations = Formation::with(['participants.user'])
            ->where('formateur_id', $user->id)
            ->where('status', 'terminee')
            ->orderBy('date_debut', 'desc')
            ->get()
            ->map(function ($formation) {
                $totalParticipants = $formation->participants->count();
                $presentCount = $formation->participants->where('status', 'present')->count();
                $absentCount = $formation->participants->where('status', 'absent')->count();
                
                return [
                    'formation_id' => $formation->id,
                    'title' => $formation->title,
                    'date_debut' => $formation->date_debut,
                    'date_fin' => $formation->date_fin,
                    'lieu' => $formation->lieu,
                    'total_participants' => $totalParticipants,
                    'present_count' => $presentCount,
                    'absent_count' => $absentCount,
                    'attendance_rate' => $totalParticipants > 0 ? round(($presentCount / $totalParticipants) * 100, 2) : 0,
                    'participants' => $formation->participants->map(function ($participant) {
                        return [
                            'user_id' => $participant->user_id,
                            'name' => $participant->user->first_name . ' ' . $participant->user->last_name,
                            'email' => $participant->user->email,
                            'status' => $participant->status,
                            'notes' => $participant->notes
                        ];
                    })
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $formations
        ]);
    }

    /**
     * Get attendance statistics for admin
     */
    public function getAttendanceStatistics()
    {
        $user = Auth::user();
        
        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Only admins can view attendance statistics'
            ], 403);
        }

        // Overall statistics
        $totalFormations = Formation::where('status', 'terminee')->count();
        $totalParticipants = FormationParticipant::whereHas('formation', function ($query) {
            $query->where('status', 'terminee');
        })->count();
        
        $presentCount = FormationParticipant::whereHas('formation', function ($query) {
            $query->where('status', 'terminee');
        })->where('status', 'present')->count();
        
        $overallAttendanceRate = $totalParticipants > 0 ? round(($presentCount / $totalParticipants) * 100, 2) : 0;

        // Attendance by team
        $attendanceByTeam = FormationParticipant::with(['user.team', 'formation'])
            ->whereHas('formation', function ($query) {
                $query->where('status', 'terminee');
            })
            ->get()
            ->groupBy('user.team.name')
            ->map(function ($participants, $teamName) {
                $total = $participants->count();
                $present = $participants->where('status', 'present')->count();
                return [
                    'team_name' => $teamName ?: 'No Team',
                    'total_participants' => $total,
                    'present_count' => $present,
                    'absent_count' => $total - $present,
                    'attendance_rate' => $total > 0 ? round(($present / $total) * 100, 2) : 0
                ];
            })->values();

        return response()->json([
            'success' => true,
            'data' => [
                'overall' => [
                    'total_formations' => $totalFormations,
                    'total_participants' => $totalParticipants,
                    'present_count' => $presentCount,
                    'absent_count' => $totalParticipants - $presentCount,
                    'attendance_rate' => $overallAttendanceRate
                ],
                'by_team' => $attendanceByTeam
            ]
        ]);
    }
}
