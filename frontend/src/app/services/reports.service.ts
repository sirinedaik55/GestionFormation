import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  teamId?: number;
  trainerId?: number;
  formationId?: number;
  status?: string;
}

export interface AttendanceReport {
  id: number;
  employeeName: string;
  email: string;
  team: string;
  formationName: string;
  formationDate: string;
  trainer: string;
  status: 'present' | 'absent' | 'pending';
  attendanceRate: number;
}

export interface FormationReport {
  id: number;
  name: string;
  date: string;
  trainer: string;
  team: string;
  totalParticipants: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
  status: string;
}

export interface TeamReport {
  id: number;
  name: string;
  speciality: string;
  totalEmployees: number;
  totalFormations: number;
  completedFormations: number;
  averageAttendanceRate: number;
  upcomingFormations: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  /**
   * Generate attendance report
   */
  getAttendanceReport(filters?: ReportFilter): Observable<AttendanceReport[]> {
    return this.http.post<AttendanceReport[]>(`${this.apiUrl}/reports/attendance`, filters || {});
  }

  /**
   * Generate formation report
   */
  getFormationReport(filters?: ReportFilter): Observable<FormationReport[]> {
    return this.http.post<FormationReport[]>(`${this.apiUrl}/reports/formations`, filters || {});
  }

  /**
   * Generate team report
   */
  getTeamReport(filters?: ReportFilter): Observable<TeamReport[]> {
    return this.http.post<TeamReport[]>(`${this.apiUrl}/reports/teams`, filters || {});
  }

  /**
   * Export attendance report to PDF
   */
  exportAttendancePDF(filters?: ReportFilter): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/reports/attendance/pdf`, filters || {}, { responseType: 'blob' });
  }

  /**
   * Export formation report to PDF
   */
  exportFormationPDF(filters?: ReportFilter): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/reports/formations/pdf`, filters || {}, { responseType: 'blob' });
  }

  /**
   * Export team report to PDF
   */
  exportTeamPDF(filters?: ReportFilter): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/reports/teams/pdf`, filters || {}, { responseType: 'blob' });
  }

  /**
   * Export attendance report to CSV
   */
  exportAttendanceCSV(filters?: ReportFilter): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/reports/attendance/csv`, filters || {}, { responseType: 'blob' });
  }

  /**
   * Export formation report to CSV
   */
  exportFormationCSV(filters?: ReportFilter): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/reports/formations/csv`, filters || {}, { responseType: 'blob' });
  }

  /**
   * Export team report to CSV
   */
  exportTeamCSV(filters?: ReportFilter): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/reports/teams/csv`, filters || {}, { responseType: 'blob' });
  }
}
