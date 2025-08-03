<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Formation;
use App\Models\User;
use App\Models\Team;
use App\Models\FormationParticipant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class StatisticsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    /**
     * Statistiques du dashboard
     */
    public function getDashboardStats()
    {
        $totalFormations = Formation::count();
        $totalEmployees = User::where('role', 'employe')->count();
        $totalTeams = Team::count();
        $totalTrainers = User::where('role', 'formateur')->count();
        
        // Calcul du taux de présence global
        $totalParticipants = FormationParticipant::count();
        $presentCount = FormationParticipant::where('attendance', 'present')->count();
        $globalAttendanceRate = $totalParticipants > 0 ? round(($presentCount / $totalParticipants) * 100, 2) : 0;
        
        // Formations par statut
        $upcomingFormations = Formation::where('date', '>', now())->count();
        $completedFormations = Formation::where('status', 'completed')->count();
        $cancelledFormations = Formation::where('status', 'cancelled')->count();
        
        return response()->json([
            'totalFormations' => $totalFormations,
            'totalEmployees' => $totalEmployees,
            'totalTeams' => $totalTeams,
            'totalTrainers' => $totalTrainers,
            'globalAttendanceRate' => $globalAttendanceRate,
            'upcomingFormations' => $upcomingFormations,
            'completedFormations' => $completedFormations,
            'cancelledFormations' => $cancelledFormations,
        ]);
    }

    /**
     * Statistiques par formation
     */
    public function formations(Request $request)
    {
        $query = Formation::with(['equipe', 'formateur']);
        
        if ($request->start_date && $request->end_date) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }
        
        $formations = $query->get()->map(function ($formation) {
            $participants = FormationParticipant::where('formation_id', $formation->id);
            $totalParticipants = $participants->count();
            $presentCount = $participants->where('attendance', 'present')->count();
            $absentCount = $participants->where('attendance', 'absent')->count();
            $attendanceRate = $totalParticipants > 0 ? round(($presentCount / $totalParticipants) * 100, 2) : 0;
            
            return [
                'id' => $formation->id,
                'name' => $formation->name,
                'date' => $formation->date,
                'totalParticipants' => $totalParticipants,
                'presentCount' => $presentCount,
                'absentCount' => $absentCount,
                'attendanceRate' => $attendanceRate,
                'team' => $formation->equipe->name ?? 'Unknown',
                'trainer' => ($formation->formateur->first_name ?? '') . ' ' . ($formation->formateur->last_name ?? ''),
            ];
        });
        
        return response()->json($formations);
    }

    /**
     * Statistiques par équipe
     */
    public function teams()
    {
        $teams = Team::with('users')->get()->map(function ($team) {
            $totalEmployees = $team->users->where('role', 'employe')->count();
            $totalFormations = Formation::where('equipe_id', $team->id)->count();
            
            // Calcul du taux de présence pour cette équipe
            $teamParticipants = FormationParticipant::whereHas('formation', function ($query) use ($team) {
                $query->where('equipe_id', $team->id);
            });
            
            $totalParticipants = $teamParticipants->count();
            $presentCount = $teamParticipants->where('attendance', 'present')->count();
            $attendanceRate = $totalParticipants > 0 ? round(($presentCount / $totalParticipants) * 100, 2) : 0;
            
            $averageFormationsPerEmployee = $totalEmployees > 0 ? round($totalFormations / $totalEmployees, 2) : 0;
            
            return [
                'id' => $team->id,
                'name' => $team->name,
                'speciality' => $team->speciality,
                'totalEmployees' => $totalEmployees,
                'totalFormations' => $totalFormations,
                'attendanceRate' => $attendanceRate,
                'averageFormationsPerEmployee' => $averageFormationsPerEmployee,
            ];
        });
        
        return response()->json($teams);
    }

    /**
     * Statistiques de présence des employés
     */
    public function employees(Request $request)
    {
        $limit = $request->limit ?? 50;
        
        $employees = User::where('role', 'employe')
            ->with(['team', 'formationParticipants'])
            ->get()
            ->map(function ($employee) {
                $totalFormations = $employee->formationParticipants->count();
                $presentCount = $employee->formationParticipants->where('attendance', 'present')->count();
                $absentCount = $employee->formationParticipants->where('attendance', 'absent')->count();
                $attendanceRate = $totalFormations > 0 ? round(($presentCount / $totalFormations) * 100, 2) : 0;
                
                return [
                    'id' => $employee->id,
                    'name' => $employee->first_name . ' ' . $employee->last_name,
                    'email' => $employee->email,
                    'team' => $employee->team->name ?? 'No team',
                    'totalFormations' => $totalFormations,
                    'presentCount' => $presentCount,
                    'absentCount' => $absentCount,
                    'attendanceRate' => $attendanceRate,
                ];
            })
            ->sortBy('attendanceRate')
            ->take($limit)
            ->values();
        
        return response()->json($employees);
    }

    /**
     * Formations par mois
     */
    public function monthly(Request $request)
    {
        $year = $request->year ?? date('Y');
        
        $monthlyData = Formation::selectRaw('MONTH(date) as month, COUNT(*) as count')
            ->whereYear('date', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) use ($year) {
                $monthName = Carbon::create($year, $item->month, 1)->format('M Y');
                
                // Calcul du taux de présence pour ce mois
                $monthFormations = Formation::whereYear('date', $year)
                    ->whereMonth('date', $item->month)
                    ->pluck('id');
                
                $monthParticipants = FormationParticipant::whereIn('formation_id', $monthFormations);
                $totalParticipants = $monthParticipants->count();
                $presentCount = $monthParticipants->where('attendance', 'present')->count();
                $attendanceRate = $totalParticipants > 0 ? round(($presentCount / $totalParticipants) * 100, 2) : 0;
                
                return [
                    'month' => $monthName,
                    'count' => $item->count,
                    'attendanceRate' => $attendanceRate,
                ];
            });
        
        return response()->json($monthlyData);
    }

    /**
     * Export statistics to PDF
     */
    public function exportToPDF(Request $request)
    {
        $type = $request->input('type'); // formations, teams, employees
        $filters = $request->input('filters', []);

        switch ($type) {
            case 'formations':
                $data = $this->formations(new Request($filters))->getData();
                break;
            case 'teams':
                $data = $this->teams()->getData();
                break;
            case 'employees':
                $data = $this->employees(new Request($filters))->getData();
                break;
            default:
                return response()->json(['error' => 'Invalid type'], 400);
        }

        // Generate PDF (placeholder implementation)
        $pdf = $this->generatePDF($data, ucfirst($type) . ' Statistics');

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $type . '-statistics.pdf"'
        ]);
    }

    /**
     * Export statistics to CSV
     */
    public function exportToCSV(Request $request)
    {
        $type = $request->input('type'); // formations, teams, employees
        $filters = $request->input('filters', []);

        switch ($type) {
            case 'formations':
                $data = $this->formations(new Request($filters))->getData();
                $headers = [
                    'name' => 'Formation Name',
                    'date' => 'Date',
                    'totalParticipants' => 'Total Participants',
                    'presentCount' => 'Present',
                    'absentCount' => 'Absent',
                    'attendanceRate' => 'Attendance Rate',
                    'team' => 'Team',
                    'trainer' => 'Trainer'
                ];
                break;
            case 'teams':
                $data = $this->teams()->getData();
                $headers = [
                    'name' => 'Team Name',
                    'speciality' => 'Speciality',
                    'totalEmployees' => 'Total Employees',
                    'totalFormations' => 'Total Formations',
                    'attendanceRate' => 'Attendance Rate',
                    'averageFormationsPerEmployee' => 'Avg Formations/Employee'
                ];
                break;
            case 'employees':
                $data = $this->employees(new Request($filters))->getData();
                $headers = [
                    'name' => 'Employee Name',
                    'email' => 'Email',
                    'team' => 'Team',
                    'totalFormations' => 'Total Formations',
                    'presentCount' => 'Present',
                    'absentCount' => 'Absent',
                    'attendanceRate' => 'Attendance Rate'
                ];
                break;
            default:
                return response()->json(['error' => 'Invalid type'], 400);
        }

        $csv = $this->generateCSV($data, $headers);

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $type . '-statistics.csv"'
        ]);
    }

    /**
     * Generate PDF (placeholder implementation)
     */
    private function generatePDF($data, $title)
    {
        // This is a placeholder - in a real app, use a PDF library like DomPDF
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
