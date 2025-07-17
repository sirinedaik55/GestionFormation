import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  /**
   * Obtenir les statistiques du dashboard
   */
  getDashboardStats(): Observable<DashboardStats> {
    // Try protected route first, fallback to test route
    return this.http.get<DashboardStats>(`${this.apiUrl}/statistics/dashboard`)
      .pipe(
        catchError(() => {
          console.log('Using test route for dashboard stats');
          return this.http.get<DashboardStats>(`${this.apiUrl}/test/statistics/dashboard`);
        })
      );
  }

  /**
   * Obtenir les statistiques par formation
   */
  getFormationStats(startDate?: string, endDate?: string): Observable<FormationStats[]> {
    let params = '';
    if (startDate && endDate) {
      params = `?start_date=${startDate}&end_date=${endDate}`;
    }
    return this.http.get<FormationStats[]>(`${this.apiUrl}/statistics/formations${params}`);
  }

  /**
   * Obtenir les statistiques par équipe
   */
  getTeamStats(): Observable<TeamStats[]> {
    return this.http.get<TeamStats[]>(`${this.apiUrl}/statistics/teams`);
  }

  /**
   * Obtenir les statistiques de présence des employés
   */
  getEmployeeAttendance(limit?: number): Observable<EmployeeAttendance[]> {
    const params = limit ? `?limit=${limit}` : '';
    return this.http.get<EmployeeAttendance[]>(`${this.apiUrl}/statistics/employees${params}`);
  }

  /**
   * Obtenir les formations par mois
   */
  getMonthlyFormations(year?: number): Observable<MonthlyFormations[]> {
    const params = year ? `?year=${year}` : '';
    return this.http.get<MonthlyFormations[]>(`${this.apiUrl}/statistics/monthly${params}`)
      .pipe(
        catchError(() => {
          console.log('Using test route for monthly formations');
          return this.http.get<MonthlyFormations[]>(`${this.apiUrl}/test/statistics/monthly${params}`);
        })
      );
  }

  /**
   * Exporter les statistiques en PDF
   */
  exportToPDF(type: 'formations' | 'teams' | 'employees', filters?: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/statistics/export/pdf`, 
      { type, filters }, 
      { responseType: 'blob' }
    );
  }

  /**
   * Exporter les statistiques en CSV
   */
  exportToCSV(type: 'formations' | 'teams' | 'employees', filters?: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/statistics/export/csv`, 
      { type, filters }, 
      { responseType: 'blob' }
    );
  }
}
