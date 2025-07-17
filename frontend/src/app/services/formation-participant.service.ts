import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FormationParticipant {
  id: number;
  formation_id: number;
  user_id: number;
  status: 'registered' | 'confirmed' | 'cancelled';
  attendance?: 'present' | 'absent' | 'pending';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    team?: {
      id: number;
      name: string;
      speciality: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class FormationParticipantService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  /**
   * Obtenir les participants d'une formation
   */
  getParticipants(formationId: number): Observable<FormationParticipant[]> {
    return this.http.get<FormationParticipant[]>(`${this.apiUrl}/formations/${formationId}/participants`);
  }

  /**
   * Mettre à jour le statut d'un participant
   */
  updateParticipantStatus(formationId: number, participantId: number, data: {
    status: 'registered' | 'confirmed' | 'cancelled';
    notes?: string;
  }): Observable<FormationParticipant> {
    return this.http.put<FormationParticipant>(
      `${this.apiUrl}/formations/${formationId}/participants/${participantId}`, 
      data
    );
  }
}
