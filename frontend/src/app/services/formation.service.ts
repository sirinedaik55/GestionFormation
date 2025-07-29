import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Formation {
    id: number;
    name: string;
    description: string;
    date: string;
    duree: number;
    equipe_id: number;
    formateur_id: number;
    room?: string;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    created_at?: string;
    updated_at?: string;

    // Relations
    team?: {
        id: number;
        name: string;
        speciality: string;
    };
    trainer?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        specialite?: string;
    };
    participants?: FormationParticipant[];
    participantCount?: number;
    attendanceRate?: number;
}

export interface FormationParticipant {
    id: number;
    formation_id: number;
    user_id: number;
    status: 'registered' | 'confirmed' | 'cancelled';
    attendance: 'pending' | 'present' | 'absent';
    created_at?: string;
    updated_at?: string;

    // Relations
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

export interface CreateFormationRequest {
    name: string;
    description: string;
    date: string;
    duree: number;
    equipe_id: number;
    formateur_id: number;
    room?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FormationService {

    constructor(private apiService: ApiService) {}

    // Get all formations
    getFormations(params?: any): Observable<Formation[]> {
        return this.apiService.get<Formation[]>('formations', params);
    }

    // Get formation by ID
    getFormation(id: number): Observable<Formation> {
        return this.apiService.get<Formation>(`formations/${id}`);
    }

    // Create new formation
    createFormation(formation: CreateFormationRequest): Observable<Formation> {
        return this.apiService.post<Formation>('formations', formation);
    }

    // Update formation
    updateFormation(id: number, formation: Partial<CreateFormationRequest>): Observable<Formation> {
        return this.apiService.put<Formation>(`formations/${id}`, formation);
    }

    // Delete formation
    deleteFormation(id: number): Observable<void> {
        return this.apiService.delete<void>(`formations/${id}`);
    }

    // Get formation participants
    getFormationParticipants(formationId: number): Observable<FormationParticipant[]> {
        return this.apiService.get<FormationParticipant[]>(`formations/${formationId}/participants`);
    }

    // Update participant status
    updateParticipantStatus(formationId: number, participantId: number, data: {
        status?: string;
        attendance?: string;
    }): Observable<FormationParticipant> {
        return this.apiService.put<FormationParticipant>(
            `formations/${formationId}/participants/${participantId}`,
            data
        );
    }

    // Employee specific methods
    getMyFormations(params?: any): Observable<Formation[]> {
        return this.apiService.get<Formation[]>('employee/formations', params);
    }

    getMyFormationDetails(id: number): Observable<Formation> {
        return this.apiService.get<Formation>(`employee/formations/${id}`);
    }

    getMyFormationHistory(params?: any): Observable<Formation[]> {
        return this.apiService.get<Formation[]>('employee/history', params);
    }

    // Trainer specific methods
    getTrainerFormations(params?: any): Observable<Formation[]> {
        return this.apiService.get<Formation[]>('trainer/formations', params);
    }

    getTrainerFormationDetails(id: number): Observable<Formation> {
        return this.apiService.get<Formation>(`trainer/formations/${id}`);
    }

    updateTrainerFormation(id: number, data: any): Observable<Formation> {
        return this.apiService.put<Formation>(`trainer/formations/${id}`, data);
    }

    // Attendance management
    markAttendance(formationId: number, attendanceData: {
        participants: { user_id: number; attendance: 'present' | 'absent' }[]
    }): Observable<any> {
        return this.apiService.post<any>(`trainer/formations/${formationId}/attendance`, attendanceData);
    }

    // Documents
    uploadFormationDocument(formationId: number, file: File, data?: any): Observable<any> {
        return this.apiService.uploadFile(`formations/${formationId}/documents`, file, data);
    }

    getFormationDocuments(formationId: number): Observable<any[]> {
        return this.apiService.get<any[]>(`formations/${formationId}/documents`);
    }

    downloadDocument(documentId: number): Observable<Blob> {
        return this.apiService.downloadFile(`documents/${documentId}/download`);
    }
}
