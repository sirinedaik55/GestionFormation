import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: 'admin' | 'formateur' | 'employe';
    team_id?: number;
    phone?: string;
    specialite?: string;
    date_debut?: string;
    date_fin?: string;
    room?: string;
    status: 'active' | 'inactive';
    created_at?: string;
    updated_at?: string;

    // Relations
    team?: {
        id: number;
        name: string;
        speciality: string;
    };
}

export interface CreateUserRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: 'admin' | 'formateur' | 'employe';
    team_id?: number;
    phone?: string;
    specialite?: string;
    date_debut?: string;
    date_fin?: string;
    room?: string;
}

export interface UpdateUserRequest {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'formateur' | 'employe';
    team_id?: number;
    phone?: string;
    specialite?: string;
    date_debut?: string;
    date_fin?: string;
    room?: string;
    status?: 'active' | 'inactive';
}

export interface UserStats {
    totalFormations: number;
    completedFormations: number;
    upcomingFormations: number;
    attendanceRate: number;
    certificates: number;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private apiService: ApiService) {}

    // Get all users
    getUsers(params?: any): Observable<User[]> {
        return this.apiService.get<User[]>('users', params);
    }

    // Get user by ID
    getUser(id: number): Observable<User> {
        return this.apiService.get<User>(`users/${id}`);
    }

    // Create new user
    createUser(user: CreateUserRequest): Observable<User> {
        return this.apiService.post<User>('users', user);
    }

    // Update user
    updateUser(id: number, user: UpdateUserRequest): Observable<User> {
        return this.apiService.put<User>(`users/${id}`, user);
    }

    // Delete user
    deleteUser(id: number): Observable<void> {
        return this.apiService.delete<void>(`users/${id}`);
    }

    // Get users by role
    getUsersByRole(role: string, params?: any): Observable<User[]> {
        return this.apiService.get<User[]>('users', { role, ...params });
    }

    // Get trainers
    getTrainers(params?: any): Observable<User[]> {
        return this.getUsersByRole('formateur', params);
    }

    // Get employees
    getEmployees(params?: any): Observable<User[]> {
        return this.getUsersByRole('employe', params);
    }

    // Employee specific methods
    getEmployeeProfile(): Observable<User> {
        return this.apiService.get<User>('employee/profile');
    }

    updateEmployeeProfile(data: Partial<UpdateUserRequest>): Observable<User> {
        return this.apiService.put<User>('employee/profile', data);
    }

    getEmployeeStats(): Observable<UserStats> {
        return this.apiService.get<UserStats>('employee/stats');
    }

    // Trainer specific methods
    getTrainerProfile(): Observable<User> {
        return this.apiService.get<User>('trainer/profile');
    }

    updateTrainerProfile(data: Partial<UpdateUserRequest>): Observable<User> {
        return this.apiService.put<User>('trainer/profile', data);
    }

    getTrainerStats(): Observable<UserStats> {
        return this.apiService.get<UserStats>('trainer/stats');
    }

    // Update user team
    updateUserTeam(userId: number, teamId: number): Observable<User> {
        return this.updateUser(userId, { team_id: teamId });
    }
}
