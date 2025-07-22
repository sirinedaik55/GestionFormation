import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces
export interface EmployeeStats {
    employee_info: {
        name: string;
        email: string;
        team: string;
        team_speciality: string;
    };
    formation_stats: {
        total_formations: number;
        completed_formations: number;
        upcoming_formations: number;
        attendance_rate: number;
        present_count: number;
        absent_count: number;
    };
    recent_formations: EmployeeFormation[];
    upcoming_formations: EmployeeFormation[];
}

export interface EmployeeFormation {
    id: number;
    name: string;
    description?: string;
    date: string;
    duree: number;
    room?: string;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    attendance: 'present' | 'absent' | 'pending';
    participation_status: 'registered' | 'confirmed' | 'cancelled';
    trainer?: {
        id: number;
        name: string;
        email: string;
    };
    team?: {
        id: number;
        name: string;
        speciality: string;
    };
}

export interface EmployeeProfile {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
    team?: {
        id: number;
        name: string;
        speciality: string;
    };
    created_at: string;
    last_login?: string;
}

export interface FormationDocument {
    id: number;
    name: string;
    type: string;
    size: string;
    uploaded_at: string;
    download_url: string;
}

export interface FormationHistory {
    id: number;
    name: string;
    date: string;
    duree: number;
    attendance: 'present' | 'absent' | 'pending';
    trainer: string;
    completion_date: string;
    has_documents: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private apiUrl = `${environment.apiUrl}/employee`;

    constructor(private http: HttpClient) {}

    /**
     * Get employee dashboard statistics
     */
    getEmployeeStats(): Observable<EmployeeStats> {
        return this.http.get<EmployeeStats>(`${this.apiUrl}/stats`);
    }

    /**
     * Get employee profile information
     */
    getProfile(): Observable<EmployeeProfile> {
        return this.http.get<EmployeeProfile>(`${this.apiUrl}/profile`);
    }

    /**
     * Get employee's assigned formations
     */
    getMyFormations(status?: 'all' | 'upcoming' | 'completed'): Observable<EmployeeFormation[]> {
        let params: { [key: string]: string } = {};
        if (status && status !== 'all') {
            params['status'] = status;
        }
        return this.http.get<EmployeeFormation[]>(`${this.apiUrl}/formations`, { params });
    }

    /**
     * Get formation details for employee
     */
    getFormationDetails(id: number): Observable<EmployeeFormation & { documents: FormationDocument[], can_download_documents: boolean }> {
        return this.http.get<EmployeeFormation & { documents: FormationDocument[], can_download_documents: boolean }>(`${this.apiUrl}/formations/${id}`);
    }

    /**
     * Get employee's formation history
     */
    getFormationHistory(year?: number, month?: number): Observable<FormationHistory[]> {
        const params: any = {};
        if (year) params.year = year.toString();
        if (month) params.month = month.toString();
        
        return this.http.get<FormationHistory[]>(`${this.apiUrl}/history`, { params });
    }

    /**
     * Get documents for a formation
     */
    getFormationDocuments(formationId: number): Observable<FormationDocument[]> {
        return this.http.get<FormationDocument[]>(`${this.apiUrl}/formations/${formationId}/documents`);
    }

    /**
     * Download formation document
     */
    downloadDocument(formationId: number, documentId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/formations/${formationId}/documents/${documentId}/download`, {
            responseType: 'blob'
        });
    }

    /**
     * Get upcoming formations for calendar/planning view
     */
    getUpcomingFormations(): Observable<EmployeeFormation[]> {
        return this.getMyFormations('upcoming');
    }

    /**
     * Get completed formations
     */
    getCompletedFormations(): Observable<EmployeeFormation[]> {
        return this.getMyFormations('completed');
    }
}
