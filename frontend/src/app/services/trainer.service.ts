import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation } from '../models/formation.model';
import { FormationParticipant } from './formation-participant.service';

export interface TrainerStats {
  totalFormations: number;
  upcomingFormations: number;
  completedFormations: number;
  totalParticipants: number;
  averageAttendanceRate: number;
  thisMonthFormations: number;
}

export interface TrainerFormation extends Formation {
  participantCount?: number;
  attendanceRate?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface AttendanceRecord {
  id: number;
  formation_id: number;
  formation_name: string;
  date: string;
  total_participants: number;
  present_count: number;
  absent_count: number;
  attendance_rate: number;
}

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  /**
   * Get trainer dashboard statistics
   */
  getTrainerStats(): Observable<TrainerStats> {
    return this.http.get<TrainerStats>(`${this.apiUrl}/trainer/stats`);
  }

  /**
   * Get formations assigned to current trainer
   */
  getMyFormations(): Observable<TrainerFormation[]> {
    return this.http.get<TrainerFormation[]>(`${this.apiUrl}/trainer/formations`);
  }

  /**
   * Get upcoming formations for trainer
   */
  getUpcomingFormations(): Observable<TrainerFormation[]> {
    return this.http.get<TrainerFormation[]>(`${this.apiUrl}/trainer/formations/upcoming`);
  }

  /**
   * Get completed formations for trainer
   */
  getCompletedFormations(): Observable<TrainerFormation[]> {
    return this.http.get<TrainerFormation[]>(`${this.apiUrl}/trainer/formations/completed`);
  }

  /**
   * Get formation details with participants
   */
  getFormationDetails(formationId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/trainer/formations/${formationId}`);
  }

  /**
   * Update formation details (limited fields for trainer)
   */
  updateFormationDetails(formationId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/trainer/formations/${formationId}`, data);
  }

  /**
   * Get participants for a formation
   */
  getFormationParticipants(formationId: number): Observable<FormationParticipant[]> {
    return this.http.get<FormationParticipant[]>(`${this.apiUrl}/trainer/formations/${formationId}/participants`);
  }

  /**
   * Update participant attendance
   */
  updateParticipantAttendance(formationId: number, participantId: number, attendance: 'present' | 'absent'): Observable<any> {
    return this.http.put(`${this.apiUrl}/trainer/formations/${formationId}/participants/${participantId}/attendance`, {
      attendance: attendance
    });
  }

  /**
   * Submit attendance for entire formation
   */
  submitAttendance(formationId: number, attendanceData: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/trainer/formations/${formationId}/attendance`, {
      attendance: attendanceData
    });
  }

  /**
   * Get attendance history for trainer
   */
  getAttendanceHistory(): Observable<AttendanceRecord[]> {
    return this.http.get<AttendanceRecord[]>(`${this.apiUrl}/trainer/attendance/history`);
  }

  /**
   * Create formation report/feedback
   */
  createFormationReport(formationId: number, reportData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/trainer/formations/${formationId}/report`, reportData);
  }

  /**
   * Get formation reports created by trainer
   */
  getMyReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trainer/reports`);
  }

  /**
   * Upload document for formation
   */
  uploadFormationDocument(formationId: number, file: File, metadata: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    
    return this.http.post(`${this.apiUrl}/trainer/formations/${formationId}/documents`, formData);
  }

  /**
   * Get documents for a formation
   */
  getFormationDocuments(formationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trainer/formations/${formationId}/documents`);
  }

  /**
   * Get all documents uploaded by trainer
   */
  getMyDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trainer/documents`);
  }

  /**
   * Delete document
   */
  deleteDocument(documentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/trainer/documents/${documentId}`);
  }
}
