import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { catchError } from 'rxjs/operators';
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

  constructor(private apiService: ApiService) { }

  /**
   * Get trainer dashboard statistics
   */
  getTrainerStats(): Observable<TrainerStats> {
    return this.apiService.get<TrainerStats>('trainer/stats').pipe(
      catchError(() => this.getMockStats())
    );
  }

  /**
   * Get formations assigned to current trainer
   */
  getMyFormations(): Observable<TrainerFormation[]> {
    return this.apiService.get<TrainerFormation[]>('trainer/formations').pipe(
      catchError(() => this.getMockFormations())
    );
  }

  /**
   * Get upcoming formations for trainer
   */
  getUpcomingFormations(): Observable<TrainerFormation[]> {
    return this.apiService.get<TrainerFormation[]>('trainer/formations/upcoming').pipe(
      catchError(() => this.getMockUpcomingFormations())
    );
  }

  /**
   * Get completed formations for trainer
   */
  getCompletedFormations(): Observable<TrainerFormation[]> {
    return this.apiService.get<TrainerFormation[]>('trainer/formations/completed').pipe(
      catchError(() => this.getMockCompletedFormations())
    );
  }

  /**
   * Get formation details with participants
   */
  getFormationDetails(formationId: number): Observable<any> {
    return this.apiService.get(`trainer/formations/${formationId}`).pipe(
      catchError(() => this.getMockFormationDetails(formationId))
    );
  }

  /**
   * Update formation details (limited fields for trainer)
   */
  updateFormationDetails(formationId: number, data: any): Observable<any> {
    return this.apiService.put(`trainer/formations/${formationId}`, data);
  }

  /**
   * Get participants for a formation
   */
  getFormationParticipants(formationId: number): Observable<FormationParticipant[]> {
    return this.apiService.get<FormationParticipant[]>(`trainer/formations/${formationId}/participants`);
  }

  /**
   * Update participant attendance
   */
  updateParticipantAttendance(formationId: number, participantId: number, attendance: 'present' | 'absent'): Observable<any> {
    return this.apiService.put(`trainer/formations/${formationId}/participants/${participantId}/attendance`, {
      attendance: attendance
    });
  }

  /**
   * Get attendance history for trainer
   */
  getAttendanceHistory(): Observable<AttendanceRecord[]> {
    return this.apiService.get<AttendanceRecord[]>('trainer/attendance/history');
  }

  /**
   * Create formation report/feedback
   */
  createFormationReport(formationId: number, reportData: any): Observable<any> {
    return this.apiService.post(`trainer/formations/${formationId}/report`, reportData);
  }

  /**
   * Get formation reports created by trainer
   */
  getMyReports(): Observable<any[]> {
    return this.apiService.get<any[]>('trainer/reports');
  }

  /**
   * Upload document for formation
   */
  uploadFormationDocument(formationId: number, file: File, metadata: any): Observable<any> {
    return this.apiService.uploadFile(`trainer/formations/${formationId}/documents`, file, metadata);
  }

  /**
   * Get documents for a formation
   */
  getFormationDocuments(formationId: number): Observable<any[]> {
    return this.apiService.get<any[]>(`trainer/formations/${formationId}/documents`);
  }

  /**
   * Get all documents uploaded by trainer
   */
  getMyDocuments(): Observable<any[]> {
    return this.apiService.get<any[]>('trainer/documents');
  }

  /**
   * Delete document
   */
  deleteDocument(documentId: number): Observable<any> {
    return this.apiService.delete(`trainer/documents/${documentId}`);
  }

  /**
   * Submit attendance for a formation
   */
  submitAttendance(formationId: number, attendanceData: any): Observable<any> {
    return this.apiService.post(`trainer/formations/${formationId}/attendance`, attendanceData);
  }

  // Mock data methods for fallback
  private getMockStats(): Observable<TrainerStats> {
    const mockStats: TrainerStats = {
      totalFormations: 8,
      upcomingFormations: 3,
      completedFormations: 5,
      totalParticipants: 45,
      averageAttendanceRate: 87,
      thisMonthFormations: 2
    };
    return of(mockStats);
  }

  private getMockFormations(): Observable<TrainerFormation[]> {
    const mockFormations: TrainerFormation[] = [
      {
        id: 1,
        name: 'Angular Advanced Concepts',
        description: 'Deep dive into Angular advanced features',
        date: '2024-07-15T10:00:00',
        duree: 6,
        equipe_id: 1,
        formateur_id: 1,
        room: 'Room A',
        status: 'completed',
        participantCount: 12,
        attendanceRate: 92
      },
      {
        id: 2,
        name: 'TypeScript Best Practices',
        description: 'Learn TypeScript best practices',
        date: '2024-07-28T14:00:00',
        duree: 4,
        equipe_id: 1,
        formateur_id: 1,
        room: 'Room B',
        status: 'upcoming',
        participantCount: 8,
        attendanceRate: 0
      }
    ];
    return of(mockFormations);
  }

  private getMockUpcomingFormations(): Observable<TrainerFormation[]> {
    return of([
      {
        id: 2,
        name: 'TypeScript Best Practices',
        description: 'Learn TypeScript best practices',
        date: '2024-07-28T14:00:00',
        duree: 4,
        equipe_id: 1,
        formateur_id: 1,
        room: 'Room B',
        status: 'upcoming',
        participantCount: 8,
        attendanceRate: 0
      }
    ]);
  }

  private getMockCompletedFormations(): Observable<TrainerFormation[]> {
    return of([
      {
        id: 1,
        name: 'Angular Advanced Concepts',
        description: 'Deep dive into Angular advanced features',
        date: '2024-07-15T10:00:00',
        duree: 6,
        equipe_id: 1,
        formateur_id: 1,
        room: 'Room A',
        status: 'completed',
        participantCount: 12,
        attendanceRate: 92
      }
    ]);
  }

  private getMockFormationDetails(formationId: number): Observable<any> {
    // Generate different formation details based on ID
    const formations = [
      {
        id: 1,
        name: 'Angular Advanced Concepts',
        description: 'Deep dive into Angular advanced features',
        date: '2024-07-15T10:00:00',
        duree: 6,
        room: 'Room A',
        participants: [
          {
            id: 1,
            user_id: 101,
            user: {
              id: 101,
              first_name: 'Ahmed',
              last_name: 'Ben Ali',
              email: 'ahmed@company.com',
              team: { name: 'Frontend' }
            }
          },
          {
            id: 2,
            user_id: 102,
            user: {
              id: 102,
              first_name: 'Fatima',
              last_name: 'Zahra',
              email: 'fatima@company.com',
              team: { name: 'Frontend' }
            }
          },
          {
            id: 3,
            user_id: 103,
            user: {
              id: 103,
              first_name: 'Mohamed',
              last_name: 'Salah',
              email: 'mohamed@company.com',
              team: { name: 'Frontend' }
            }
          },
          {
            id: 4,
            user_id: 104,
            user: {
              id: 104,
              first_name: 'Aisha',
              last_name: 'Mansouri',
              email: 'aisha@company.com',
              team: { name: 'Frontend' }
            }
          },
          {
            id: 5,
            user_id: 105,
            user: {
              id: 105,
              first_name: 'Youssef',
              last_name: 'Alami',
              email: 'youssef@company.com',
              team: { name: 'Frontend' }
            }
          }
        ]
      },
      {
        id: 2,
        name: 'TypeScript Best Practices',
        description: 'Learn TypeScript best practices',
        date: '2024-07-20T14:00:00',
        duree: 4,
        room: 'Room B',
        participants: [
          {
            id: 6,
            user_id: 106,
            user: {
              id: 106,
              first_name: 'Laila',
              last_name: 'Benali',
              email: 'laila@company.com',
              team: { name: 'Backend' }
            }
          },
          {
            id: 7,
            user_id: 107,
            user: {
              id: 107,
              first_name: 'Omar',
              last_name: 'Tazi',
              email: 'omar@company.com',
              team: { name: 'Backend' }
            }
          },
          {
            id: 8,
            user_id: 108,
            user: {
              id: 108,
              first_name: 'Nadia',
              last_name: 'Chraibi',
              email: 'nadia@company.com',
              team: { name: 'Backend' }
            }
          }
        ]
      },
      {
        id: 3,
        name: 'React Fundamentals',
        description: 'Introduction to React components',
        date: '2024-07-25T09:00:00',
        duree: 8,
        room: 'Room C',
        participants: [
          {
            id: 9,
            user_id: 109,
            user: {
              id: 109,
              first_name: 'Karim',
              last_name: 'Fassi',
              email: 'karim@company.com',
              team: { name: 'Frontend' }
            }
          },
          {
            id: 10,
            user_id: 110,
            user: {
              id: 110,
              first_name: 'Samira',
              last_name: 'Idrissi',
              email: 'samira@company.com',
              team: { name: 'Frontend' }
            }
          },
          {
            id: 11,
            user_id: 111,
            user: {
              id: 111,
              first_name: 'Hassan',
              last_name: 'Berrada',
              email: 'hassan@company.com',
              team: { name: 'Frontend' }
            }
          },
          {
            id: 12,
            user_id: 112,
            user: {
              id: 112,
              first_name: 'Zineb',
              last_name: 'Alaoui',
              email: 'zineb@company.com',
              team: { name: 'Frontend' }
            }
          }
        ]
      }
    ];

    // Find formation by ID or return first one as default
    const formation = formations.find(f => f.id === formationId) || formations[0];

    return of(formation);
  }
}
