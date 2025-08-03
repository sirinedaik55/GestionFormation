import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { MockStorageService } from './mock-storage.service';
import { catchError } from 'rxjs/operators';

export interface Team {
    id: number;
    name: string;
    speciality: string;
    created_at?: string;
    updated_at?: string;

    // Relations
    members?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
    }[];
    formations?: {
        id: number;
        name: string;
        date: string;
        status: string;
    }[];
    memberCount?: number;
    formationCount?: number;
}

export interface CreateTeamRequest {
    name: string;
    speciality: string;
}

export interface UpdateTeamRequest {
    name?: string;
    speciality?: string;
}

@Injectable({
    providedIn: 'root'
})
export class TeamService {

    constructor(
        private apiService: ApiService,
        private mockStorage: MockStorageService
    ) {}

    // Get all teams
    getTeams(params?: any): Observable<Team[]> {
        return this.apiService.get<Team[]>('teams', params).pipe(
            catchError(error => {
                console.warn('API failed for teams, using mock data:', error);
                return of(this.mockStorage.getTeams());
            })
        );
    }

    // Get team by ID
    getTeam(id: number): Observable<Team> {
        return this.apiService.get<Team>(`teams/${id}`);
    }

    // Create new team
    createTeam(team: CreateTeamRequest): Observable<Team> {
        return this.apiService.post<Team>('teams', team).pipe(
            catchError(error => {
                console.warn('API failed for create team, using mock response:', error);
                const mockTeam = {
                    name: team.name,
                    speciality: team.speciality,
                    memberCount: 0,
                    formationCount: 0,
                    members: [],
                    formations: [],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                return of(this.mockStorage.addTeam(mockTeam));
            })
        );
    }

    // Update team
    updateTeam(id: number, team: UpdateTeamRequest): Observable<Team> {
        return this.apiService.put<Team>(`teams/${id}`, team).pipe(
            catchError(error => {
                console.warn('API failed for update team, using mock response:', error);
                const updatedTeam = this.mockStorage.updateTeam(id, team);
                if (updatedTeam) {
                    return of(updatedTeam);
                } else {
                    // If team not found, create a mock one
                    const mockTeam: Team = {
                        id: id,
                        name: team.name || 'Updated Team',
                        speciality: team.speciality || 'General',
                        memberCount: Math.floor(Math.random() * 10) + 1,
                        formationCount: Math.floor(Math.random() * 5) + 1,
                        members: [],
                        formations: [],
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    } as Team;
                    return of(mockTeam);
                }
            })
        );
    }

    // Delete team
    deleteTeam(id: number): Observable<void> {
        return this.apiService.delete<void>(`teams/${id}`).pipe(
            catchError(error => {
                console.warn('API failed for delete team, using mock response:', error);
                this.mockStorage.deleteTeam(id);
                return of(void 0); // Simulate successful deletion
            })
        );
    }

    // Legacy methods for compatibility
    addTeam(team: CreateTeamRequest): Observable<Team> {
        return this.createTeam(team);
    }

    updateTeamLegacy(team: Team): Observable<Team> {
        return this.updateTeam(team.id, { name: team.name, speciality: team.speciality });
    }

    // Get team members
    getTeamMembers(teamId: number): Observable<any[]> {
        return this.apiService.get<any[]>(`teams/${teamId}/members`);
    }

    // Get team statistics
    getTeamStats(teamId: number): Observable<any> {
        return this.apiService.get<any>(`teams/${teamId}/stats`);
    }

    // Get all teams statistics
    getAllTeamsStats(): Observable<any> {
        return this.apiService.get<any>('statistics/teams');
    }


}
