<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Formation;
use App\Models\User;
use App\Models\Team;
use App\Models\FormationParticipant;
use Carbon\Carbon;

class ReportsController extends Controller
{
    /**
     * Generate attendance report
     */
    public function attendanceReport(Request $request)
    {
        $query = FormationParticipant::with(['user', 'formation.team', 'formation.trainer']);
        
        // Apply filters
        if ($request->startDate) {
            $query->whereHas('formation', function($q) use ($request) {
                $q->where('date', '>=', $request->startDate);
            });
        }
        
        if ($request->endDate) {
            $query->whereHas('formation', function($q) use ($request) {
                $q->where('date', '<=', $request->endDate);
            });
        }
        
        if ($request->teamId) {
            $query->whereHas('formation', function($q) use ($request) {
                $q->where('equipe_id', $request->teamId);
            });
        }
        
        if ($request->trainerId) {
            $query->whereHas('formation', function($q) use ($request) {
                $q->where('formateur_id', $request->trainerId);
            });
        }
        
        if ($request->status) {
            $query->where('attendance', $request->status);
        }
        
        $participants = $query->get();
        
        $report = $participants->map(function ($participant) {
            // Calculate attendance rate for this employee
            $totalFormations = FormationParticipant::where('user_id', $participant->user_id)->count();
            $presentCount = FormationParticipant::where('user_id', $participant->user_id)
                ->where('attendance', 'present')->count();
            $attendanceRate = $totalFormations > 0 ? round(($presentCount / $totalFormations) * 100, 2) : 0;
            
            return [
                'id' => $participant->id,
                'employeeName' => $participant->user->first_name . ' ' . $participant->user->last_name,
                'email' => $participant->user->email,
                'team' => $participant->formation->team->name ?? 'No team',
                'formationName' => $participant->formation->name,
                'formationDate' => $participant->formation->date,
                'trainer' => $participant->formation->trainer->first_name . ' ' . $participant->formation->trainer->last_name,
                'status' => $participant->attendance ?? 'pending',
                'attendanceRate' => $attendanceRate,
            ];
        });
        
        return response()->json($report);
    }
    
    /**
     * Generate formation report
     */
    public function formationReport(Request $request)
    {
        $query = Formation::with(['team', 'trainer', 'participants']);
        
        // Apply filters
        if ($request->startDate) {
            $query->where('date', '>=', $request->startDate);
        }
        
        if ($request->endDate) {
            $query->where('date', '<=', $request->endDate);
        }
        
        if ($request->teamId) {
            $query->where('equipe_id', $request->teamId);
        }
        
        if ($request->trainerId) {
            $query->where('formateur_id', $request->trainerId);
        }
        
        if ($request->status) {
            $query->where('status', $request->status);
        }
        
        $formations = $query->get();
        
        $report = $formations->map(function ($formation) {
            $totalParticipants = $formation->participants->count();
            $presentCount = $formation->participants->where('attendance', 'present')->count();
            $absentCount = $formation->participants->where('attendance', 'absent')->count();
            $attendanceRate = $totalParticipants > 0 ? round(($presentCount / $totalParticipants) * 100, 2) : 0;
            
            return [
                'id' => $formation->id,
                'name' => $formation->name,
                'date' => $formation->date,
                'trainer' => $formation->trainer->first_name . ' ' . $formation->trainer->last_name,
                'team' => $formation->team->name ?? 'No team',
                'totalParticipants' => $totalParticipants,
                'presentCount' => $presentCount,
                'absentCount' => $absentCount,
                'attendanceRate' => $attendanceRate,
                'status' => $formation->status ?? 'active',
            ];
        });
        
        return response()->json($report);
    }
    
    /**
     * Generate team report
     */
    public function teamReport(Request $request)
    {
        $query = Team::with(['users', 'formations']);
        
        $teams = $query->get();
        
        $report = $teams->map(function ($team) {
            $totalEmployees = $team->users->where('role', 'employe')->count();
            $totalFormations = $team->formations->count();
            $completedFormations = $team->formations->where('status', 'completed')->count();
            $upcomingFormations = $team->formations->where('date', '>', now())->count();
            
            // Calculate average attendance rate for team
            $teamParticipants = FormationParticipant::whereHas('formation', function($q) use ($team) {
                $q->where('equipe_id', $team->id);
            })->get();
            
            $totalParticipants = $teamParticipants->count();
            $presentCount = $teamParticipants->where('attendance', 'present')->count();
            $averageAttendanceRate = $totalParticipants > 0 ? round(($presentCount / $totalParticipants) * 100, 2) : 0;
            
            return [
                'id' => $team->id,
                'name' => $team->name,
                'speciality' => $team->speciality,
                'totalEmployees' => $totalEmployees,
                'totalFormations' => $totalFormations,
                'completedFormations' => $completedFormations,
                'upcomingFormations' => $upcomingFormations,
                'averageAttendanceRate' => $averageAttendanceRate,
            ];
        });
        
        return response()->json($report);
    }
    
    /**
     * Export attendance report to PDF
     */
    public function exportAttendancePDF(Request $request)
    {
        // This would typically use a PDF library like DomPDF or TCPDF
        // For now, return a simple response
        $data = $this->attendanceReport($request)->getData();
        
        // In a real implementation, generate PDF here
        $pdf = $this->generatePDF($data, 'Attendance Report');
        
        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="attendance-report.pdf"'
        ]);
    }
    
    /**
     * Export formation report to PDF
     */
    public function exportFormationPDF(Request $request)
    {
        $data = $this->formationReport($request)->getData();
        $pdf = $this->generatePDF($data, 'Formation Report');
        
        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="formation-report.pdf"'
        ]);
    }
    
    /**
     * Export team report to PDF
     */
    public function exportTeamPDF(Request $request)
    {
        $data = $this->teamReport($request)->getData();
        $pdf = $this->generatePDF($data, 'Team Report');
        
        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="team-report.pdf"'
        ]);
    }
    
    /**
     * Export attendance report to CSV
     */
    public function exportAttendanceCSV(Request $request)
    {
        $data = $this->attendanceReport($request)->getData();
        $csv = $this->generateCSV($data, [
            'employeeName' => 'Employee Name',
            'email' => 'Email',
            'team' => 'Team',
            'formationName' => 'Formation',
            'formationDate' => 'Date',
            'trainer' => 'Trainer',
            'status' => 'Status',
            'attendanceRate' => 'Attendance Rate'
        ]);
        
        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="attendance-report.csv"'
        ]);
    }
    
    /**
     * Export formation report to CSV
     */
    public function exportFormationCSV(Request $request)
    {
        $data = $this->formationReport($request)->getData();
        $csv = $this->generateCSV($data, [
            'name' => 'Formation Name',
            'date' => 'Date',
            'trainer' => 'Trainer',
            'team' => 'Team',
            'totalParticipants' => 'Total Participants',
            'presentCount' => 'Present',
            'absentCount' => 'Absent',
            'attendanceRate' => 'Attendance Rate',
            'status' => 'Status'
        ]);
        
        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="formation-report.csv"'
        ]);
    }
    
    /**
     * Export team report to CSV
     */
    public function exportTeamCSV(Request $request)
    {
        $data = $this->teamReport($request)->getData();
        $csv = $this->generateCSV($data, [
            'name' => 'Team Name',
            'speciality' => 'Speciality',
            'totalEmployees' => 'Total Employees',
            'totalFormations' => 'Total Formations',
            'completedFormations' => 'Completed',
            'upcomingFormations' => 'Upcoming',
            'averageAttendanceRate' => 'Avg Attendance Rate'
        ]);
        
        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="team-report.csv"'
        ]);
    }
    
    /**
     * Generate PDF (placeholder implementation)
     */
    private function generatePDF($data, $title)
    {
        // This is a placeholder - in a real app, use a PDF library
        $content = "PDF Report: $title\n\n";
        $content .= json_encode($data, JSON_PRETTY_PRINT);
        return $content;
    }
    
    /**
     * Generate CSV
     */
    private function generateCSV($data, $headers)
    {
        $output = fopen('php://temp', 'r+');
        
        // Write headers
        fputcsv($output, array_values($headers));
        
        // Write data
        foreach ($data as $row) {
            $csvRow = [];
            foreach (array_keys($headers) as $key) {
                $csvRow[] = $row->$key ?? '';
            }
            fputcsv($output, $csvRow);
        }
        
        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);
        
        return $csv;
    }
}
