import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

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

    constructor(private apiService: ApiService) {}

    // Get all teams
    getTeams(params?: any): Observable<Team[]> {
        return this.apiService.get<Team[]>('teams', params);
    }

    // Get team by ID
    getTeam(id: number): Observable<Team> {
        return this.apiService.get<Team>(`teams/${id}`);
    }

    // Create new team
    createTeam(team: CreateTeamRequest): Observable<Team> {
        return this.apiService.post<Team>('teams', team);
    }

    // Update team
    updateTeam(id: number, team: UpdateTeamRequest): Observable<Team> {
        return this.apiService.put<Team>(`teams/${id}`, team);
    }

    // Delete team
    deleteTeam(id: number): Observable<void> {
        return this.apiService.delete<void>(`teams/${id}`);
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
