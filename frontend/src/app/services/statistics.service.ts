import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

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
    return this.apiService.get<DashboardStats>('statistics/dashboard');
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
    return this.apiService.get<FormationStats[]>('statistics/formations', params);
  }

  /**
   * Obtenir les statistiques par équipe
   */
  getTeamStats(): Observable<TeamStats[]> {
    return this.apiService.get<TeamStats[]>('statistics/teams');
  }

  /**
   * Obtenir les statistiques de présence des employés
   */
  getEmployeeAttendance(limit?: number): Observable<EmployeeAttendance[]> {
    const params = limit ? { limit } : {};
    return this.apiService.get<EmployeeAttendance[]>('statistics/employees', params);
  }

  /**
   * Obtenir les formations par mois
   */
  getMonthlyFormations(year?: number): Observable<MonthlyFormations[]> {
    const params = year ? { year } : {};
    return this.apiService.get<MonthlyFormations[]>('statistics/monthly', params);
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
