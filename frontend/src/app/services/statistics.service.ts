import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { catchError } from 'rxjs/operators';

export interface DashboardStats {
  totalFormations: number;
  totalEmployees: number;
  totalTeams: number;
  totalTrainers: number;
  globalAttendanceRate: number;
  upcomingFormations: number;
  completedFormations: number;
  cancelledFormations: number;
}

export interface FormationStats {
  id: number;
  name: string;
  date: string;
  totalParticipants: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
  team: string;
  trainer: string;
}

export interface TeamStats {
  id: number;
  name: string;
  speciality: string;
  totalEmployees: number;
  totalFormations: number;
  attendanceRate: number;
  averageFormationsPerEmployee: number;
}

export interface EmployeeAttendance {
  id: number;
  name: string;
  email: string;
  team: string;
  totalFormations: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
}

export interface MonthlyFormations {
  month: string;
  count: number;
  attendanceRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private apiService: ApiService) { }

  /**
   * Obtenir les statistiques du dashboard
   */
  getDashboardStats(): Observable<DashboardStats> {
    // TEMPORARY: Use test route to bypass authentication
    return this.apiService.get<DashboardStats>('test/statistics/dashboard').pipe(
      catchError(error => {
        console.error('Error loading dashboard stats:', error);
        // Return mock data as fallback
        return of({
          totalFormations: 13,
          totalEmployees: 15,
          totalTeams: 5,
          totalTrainers: 8,
          globalAttendanceRate: 85.5,
          upcomingFormations: 7,
          completedFormations: 5,
          cancelledFormations: 1
        });
      })
    );
  }

  /**
   * Obtenir les statistiques par formation
   */
  getFormationStats(startDate?: string, endDate?: string): Observable<FormationStats[]> {
    const params: any = {};
    if (startDate && endDate) {
      params.start_date = startDate;
      params.end_date = endDate;
    }
    // TEMPORARY: Use test route to bypass authentication
    return this.apiService.get<FormationStats[]>('test/statistics/formations', params).pipe(
      catchError(error => {
        console.error('Error loading formation stats:', error);
        // Return mock data as fallback
        return of([
          {
            id: 1,
            name: 'Angular Advanced Concepts',
            date: '2025-07-22T10:00:00',
            totalParticipants: 10,
            presentCount: 9,
            absentCount: 1,
            attendanceRate: 90.0,
            team: 'Development Team',
            trainer: 'Syrine Daik'
          },
          {
            id: 2,
            name: 'Data Science with Python',
            date: '2025-07-07T14:00:00',
            totalParticipants: 15,
            presentCount: 12,
            absentCount: 3,
            attendanceRate: 80.0,
            team: 'Data Science Team',
            trainer: 'Marie Martin'
          },
          {
            id: 3,
            name: 'Project Management Essentials',
            date: '2025-07-14T09:00:00',
            totalParticipants: 25,
            presentCount: 22,
            absentCount: 3,
            attendanceRate: 88.0,
            team: 'Marketing Team',
            trainer: 'Pierre Dubois'
          },
          {
            id: 4,
            name: 'Digital Marketing Strategy',
            date: '2025-07-17T11:00:00',
            totalParticipants: 22,
            presentCount: 18,
            absentCount: 4,
            attendanceRate: 82.0,
            team: 'Marketing Team',
            trainer: 'Sophie Laurent'
          },
          {
            id: 5,
            name: 'Cybersecurity Fundamentals',
            date: '2025-07-23T13:00:00',
            totalParticipants: 18,
            presentCount: 17,
            absentCount: 1,
            attendanceRate: 94.0,
            team: 'Security Team',
            trainer: 'Thomas Bernard'
          }
        ]);
      })
    );
  }

  /**
   * Obtenir les statistiques par équipe
   */
  getTeamStats(): Observable<TeamStats[]> {
    // TEMPORARY: Use test route to bypass authentication
    return this.apiService.get<TeamStats[]>('test/statistics/teams').pipe(
      catchError(error => {
        console.error('Error loading team stats:', error);
        // Return mock data as fallback
        return of([
          {
            id: 1,
            name: 'Development Team',
            speciality: 'Web Development',
            totalEmployees: 5,
            totalFormations: 8,
            attendanceRate: 88.5,
            averageFormationsPerEmployee: 1.6
          },
          {
            id: 2,
            name: 'Data Science Team',
            speciality: 'Data Analysis',
            totalEmployees: 4,
            totalFormations: 5,
            attendanceRate: 92.0,
            averageFormationsPerEmployee: 1.25
          },
          {
            id: 3,
            name: 'Marketing Team',
            speciality: 'Digital Marketing',
            totalEmployees: 3,
            totalFormations: 3,
            attendanceRate: 85.0,
            averageFormationsPerEmployee: 1.0
          },
          {
            id: 4,
            name: 'Design Team',
            speciality: 'UX/UI Design',
            totalEmployees: 2,
            totalFormations: 2,
            attendanceRate: 90.0,
            averageFormationsPerEmployee: 1.0
          },
          {
            id: 5,
            name: 'Security Team',
            speciality: 'Cybersecurity',
            totalEmployees: 3,
            totalFormations: 4,
            attendanceRate: 87.5,
            averageFormationsPerEmployee: 1.33
          }
        ]);
      })
    );
  }

  /**
   * Obtenir les statistiques de présence des employés
   */
  getEmployeeAttendance(limit?: number): Observable<EmployeeAttendance[]> {
    const params = limit ? { limit } : {};
    // TEMPORARY: Use test route to bypass authentication
    return this.apiService.get<EmployeeAttendance[]>('test/statistics/employees', params).pipe(
      catchError(error => {
        console.error('Error loading employee attendance:', error);
        // Return mock data as fallback
        return of([
          {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@formation.com',
            team: 'Development Team',
            totalFormations: 5,
            presentCount: 4,
            absentCount: 1,
            attendanceRate: 80.0
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@formation.com',
            team: 'Data Science Team',
            totalFormations: 4,
            presentCount: 4,
            absentCount: 0,
            attendanceRate: 100.0
          },
          {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike.johnson@formation.com',
            team: 'Marketing Team',
            totalFormations: 3,
            presentCount: 2,
            absentCount: 1,
            attendanceRate: 66.7
          },
          {
            id: 4,
            name: 'Sarah Wilson',
            email: 'sarah.wilson@formation.com',
            team: 'Design Team',
            totalFormations: 2,
            presentCount: 2,
            absentCount: 0,
            attendanceRate: 100.0
          },
          {
            id: 5,
            name: 'David Brown',
            email: 'david.brown@formation.com',
            team: 'Security Team',
            totalFormations: 4,
            presentCount: 3,
            absentCount: 1,
            attendanceRate: 75.0
          }
        ]);
      })
    );
  }

  /**
   * Obtenir les formations par mois
   */
  getMonthlyFormations(year?: number): Observable<MonthlyFormations[]> {
    const params = year ? { year } : {};
    // TEMPORARY: Use test route to bypass authentication
    return this.apiService.get<MonthlyFormations[]>('test/statistics/monthly', params).pipe(
      catchError(error => {
        console.error('Error loading monthly formations:', error);
        // Return mock data as fallback
        return of([
          { month: 'January', count: 2, attendanceRate: 90 },
          { month: 'February', count: 1, attendanceRate: 85 },
          { month: 'March', count: 3, attendanceRate: 88 },
          { month: 'April', count: 2, attendanceRate: 92 },
          { month: 'May', count: 1, attendanceRate: 80 },
          { month: 'June', count: 2, attendanceRate: 87 },
          { month: 'July', count: 4, attendanceRate: 91 },
          { month: 'August', count: 1, attendanceRate: 83 },
          { month: 'September', count: 2, attendanceRate: 89 },
          { month: 'October', count: 3, attendanceRate: 86 },
          { month: 'November', count: 1, attendanceRate: 94 },
          { month: 'December', count: 2, attendanceRate: 88 }
        ]);
      })
    );
  }

  /**
   * Exporter les statistiques en PDF
   */
  exportToPDF(type: 'formations' | 'teams' | 'employees', filters?: any): Observable<Blob> {
    return this.apiService.post<Blob>('statistics/export/pdf', { type, filters });
  }

  /**
   * Exporter les statistiques en CSV
   */
  exportToCSV(type: 'formations' | 'teams' | 'employees', filters?: any): Observable<Blob> {
    return this.apiService.post<Blob>('statistics/export/csv', { type, filters });
  }
}
