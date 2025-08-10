import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Attendance {
  id?: number;
  formation_id: number;
  user_id: number;
  status: 'present' | 'absent' | 'late';
  notes?: string;
  taken_by: number;
  taken_at?: string;
  sent_to_admin: boolean;
  sent_at?: string;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  formation?: {
    id: number;
    name: string;
    date: string;
  };
  trainer?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export interface FormationParticipant {
  id: number;
  name: string;
  email: string;
  team?: string;
  status: string;
  attendance?: 'present' | 'absent' | 'late';
  notes?: string; // Added notes property
}

export interface AttendanceData {
  formation: {
    id: number;
    name: string;
    date: string;
    room: string;
  };
  participants: FormationParticipant[];
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  constructor(private apiService: ApiService) {}

  getFormationParticipants(formationId: number): Observable<AttendanceData> {
    return this.apiService.get<AttendanceData>(`attendance/formation/${formationId}/participants`);
  }

  takeAttendance(formationId: number, attendances: Attendance[]): Observable<any> {
    return this.apiService.post<any>(`attendance/formation/${formationId}/take`, {
      attendances
    });
  }

  sendToAdmin(formationId: number): Observable<any> {
    return this.apiService.post<any>(`attendance/formation/${formationId}/send-to-admin`, {});
  }

  getAllAttendances(filters?: {
    formation_id?: number;
    trainer_id?: number;
    status?: string;
    sent_to_admin?: boolean;
  }): Observable<Attendance[]> {
    return this.apiService.get<Attendance[]>('attendance/all', filters);
  }

  getAttendanceStats(attendances: Attendance[]): {
    total: number;
    present: number;
    absent: number;
    late: number;
    rate: number;
  } {
    const total = attendances.length;
    const present = attendances.filter(a => a.status === 'present').length;
    const absent = attendances.filter(a => a.status === 'absent').length;
    const late = attendances.filter(a => a.status === 'late').length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, late, rate };
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'present':
        return 'Présent';
      case 'absent':
        return 'Absent';
      case 'late':
        return 'En retard';
      default:
        return status;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'danger';
      case 'late':
        return 'warning';
      default:
        return 'info';
    }
  }
}