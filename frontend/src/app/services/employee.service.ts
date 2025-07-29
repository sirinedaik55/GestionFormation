import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

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

    constructor(private apiService: ApiService) {}

    /**
     * Get employee dashboard statistics
     */
    getEmployeeStats(): Observable<EmployeeStats> {
        return this.apiService.get<EmployeeStats>('employee/stats').pipe(
            catchError(error => {
                console.warn('API failed, using mock data:', error);
                return this.getMockStats();
            })
        );
    }

    /**
     * Get employee profile information
     */
    getProfile(): Observable<EmployeeProfile> {
        return this.apiService.get<EmployeeProfile>('employee/profile').pipe(
            catchError(error => {
                console.warn('API failed, using mock data:', error);
                return this.getMockProfile();
            })
        );
    }

    /**
     * Get employee's assigned formations
     */
    getMyFormations(status?: 'all' | 'upcoming' | 'completed'): Observable<EmployeeFormation[]> {
        const params: any = {};
        if (status && status !== 'all') {
            params.status = status;
        }
        return this.apiService.get<EmployeeFormation[]>('employee/formations', params).pipe(
            catchError(error => {
                console.warn('API failed, using mock data:', error);
                return this.getMockFormations(status);
            })
        );
    }

    /**
     * Get formation details for employee
     */
    getFormationDetails(id: number): Observable<EmployeeFormation & { documents: FormationDocument[], can_download_documents: boolean }> {
        return this.apiService.get<EmployeeFormation & { documents: FormationDocument[], can_download_documents: boolean }>(`employee/formations/${id}`).pipe(
            catchError(error => {
                console.warn('API failed, using mock data:', error);
                return this.getMockFormationDetails(id);
            })
        );
    }

    /**
     * Get employee's formation history
     */
    getFormationHistory(year?: number, month?: number): Observable<FormationHistory[]> {
        const params: any = {};
        if (year) params.year = year;
        if (month) params.month = month;

        return this.apiService.get<FormationHistory[]>('employee/history', params).pipe(
            catchError(error => {
                console.warn('API failed, using mock data:', error);
                return this.getMockHistory();
            })
        );
    }

    /**
     * Get documents for a formation
     */
    getFormationDocuments(formationId: number): Observable<FormationDocument[]> {
        return this.apiService.get<FormationDocument[]>(`employee/formations/${formationId}/documents`).pipe(
            catchError(error => {
                console.warn('API failed, using mock data:', error);
                return this.getMockDocuments(formationId);
            })
        );
    }

    /**
     * Download formation document
     */
    downloadDocument(formationId: number, documentId: number): Observable<Blob> {
        return this.apiService.downloadFile(`employee/formations/${formationId}/documents/${documentId}/download`);
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

    // Mock data methods for fallback
    private getMockStats(): Observable<EmployeeStats> {
        const mockStats: EmployeeStats = {
            employee_info: {
                name: 'Ahmed Ben Ali',
                email: 'ahmed.benali@company.com',
                team: 'Development Team',
                team_speciality: 'Web Development'
            },
            formation_stats: {
                total_formations: 4,
                completed_formations: 3,
                upcoming_formations: 1,
                attendance_rate: 85,
                present_count: 3,
                absent_count: 1
            },
            recent_formations: [
                {
                    id: 1,
                    name: 'Angular Advanced Concepts',
                    date: '2024-07-15T10:00:00',
                    duree: 6,
                    status: 'completed',
                    attendance: 'present',
                    participation_status: 'confirmed',
                    trainer: {
                        id: 1,
                        name: 'Syrine Daik',
                        email: 'trainer@formation.com'
                    },
                    room: 'Room A'
                }
            ],
            upcoming_formations: [
                {
                    id: 2,
                    name: 'TypeScript Best Practices',
                    date: '2024-07-28T14:00:00',
                    duree: 4,
                    status: 'upcoming',
                    attendance: 'pending',
                    participation_status: 'confirmed',
                    trainer: {
                        id: 1,
                        name: 'Syrine Daik',
                        email: 'trainer@formation.com'
                    },
                    room: 'Room B'
                }
            ]
        };
        return of(mockStats);
    }

    private getMockProfile(): Observable<EmployeeProfile> {
        const mockProfile: EmployeeProfile = {
            id: 4,
            first_name: 'Ahmed',
            last_name: 'Ben Ali',
            email: 'ahmed.benali@company.com',
            role: 'employe',
            status: 'active',
            team: {
                id: 1,
                name: 'Development Team',
                speciality: 'Web Development'
            },
            created_at: '2023-01-15T00:00:00'
        };
        return of(mockProfile);
    }

    private getMockFormations(status?: string): Observable<EmployeeFormation[]> {
        const allFormations: EmployeeFormation[] = [
            {
                id: 1,
                name: 'Angular Advanced Concepts',
                date: '2024-07-15T10:00:00',
                duree: 6,
                status: 'completed',
                attendance: 'present',
                participation_status: 'confirmed',
                trainer: {
                    id: 1,
                    name: 'Syrine Daik',
                    email: 'trainer@formation.com'
                },
                room: 'Room A'
            },
            {
                id: 2,
                name: 'TypeScript Best Practices',
                date: '2024-07-28T14:00:00',
                duree: 4,
                status: 'upcoming',
                attendance: 'pending',
                participation_status: 'confirmed',
                trainer: {
                    id: 1,
                    name: 'Syrine Daik',
                    email: 'trainer@formation.com'
                },
                room: 'Room B'
            }
        ];

        let filteredFormations = allFormations;
        if (status === 'completed') {
            filteredFormations = allFormations.filter(f => f.status === 'completed');
        } else if (status === 'upcoming') {
            filteredFormations = allFormations.filter(f => f.status === 'upcoming');
        }

        return of(filteredFormations);
    }

    private getMockFormationDetails(id: number): Observable<EmployeeFormation & { documents: FormationDocument[], can_download_documents: boolean }> {
        const formation = {
            id: id,
            name: 'Angular Advanced Concepts',
            date: '2024-07-15T10:00:00',
            duree: 6,
            status: 'completed' as const,
            attendance: 'present' as const,
            participation_status: 'confirmed' as const,
            trainer: {
                id: 1,
                name: 'Syrine Daik',
                email: 'trainer@formation.com'
            },
            room: 'Room A',
            documents: [
                {
                    id: 1,
                    name: 'Angular Guide.pdf',
                    type: 'pdf',
                    size: '2.5 MB',
                    uploaded_at: '2024-07-15T10:00:00',
                    download_url: '/documents/1/download'
                }
            ],
            can_download_documents: true
        };
        return of(formation);
    }

    private getMockHistory(): Observable<FormationHistory[]> {
        const history: FormationHistory[] = [
            {
                id: 1,
                name: 'Angular Advanced Concepts',
                date: '2024-07-15T10:00:00',
                duree: 6,
                attendance: 'present',
                trainer: 'Syrine Daik',
                completion_date: '2024-07-15T16:00:00',
                has_documents: true
            }
        ];
        return of(history);
    }

    private getMockDocuments(formationId: number): Observable<FormationDocument[]> {
        const documents: FormationDocument[] = [
            {
                id: 1,
                name: 'Angular Guide.pdf',
                type: 'pdf',
                size: '2.5 MB',
                uploaded_at: '2024-07-15T10:00:00',
                download_url: '/documents/1/download'
            }
        ];
        return of(documents);
    }
}
