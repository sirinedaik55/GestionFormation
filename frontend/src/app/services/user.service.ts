import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { MockStorageService } from './mock-storage.service';
import { catchError } from 'rxjs/operators';

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

    constructor(
        private apiService: ApiService,
        private mockStorage: MockStorageService
    ) {}

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
        return this.apiService.post<User>('users', user).pipe(
            catchError(error => {
                console.warn('API failed for create user, using mock response:', error);
                const mockUser = {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone || '',
                    status: 'active' as const,
                    team_id: user.team_id,
                    specialite: user.specialite,
                    room: user.room,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                return of(this.mockStorage.addUser(mockUser));
            })
        );
    }

    // Update user
    updateUser(id: number, user: UpdateUserRequest): Observable<User> {
        return this.apiService.put<User>(`users/${id}`, user).pipe(
            catchError(error => {
                console.warn('API failed for update user, using mock response:', error);
                const updatedUser = this.mockStorage.updateUser(id, user);
                if (updatedUser) {
                    return of(updatedUser);
                } else {
                    // If user not found, create a new one
                    const mockUser: User = {
                        id: id,
                        first_name: user.first_name || 'Updated',
                        last_name: user.last_name || 'User',
                        email: user.email || 'updated@formation.com',
                        role: user.role || 'employe',
                        phone: user.phone || '',
                        status: (user.status as 'active' | 'inactive') || 'active',
                        team_id: user.team_id,
                        specialite: user.specialite,
                        room: user.room,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    } as User;
                    return of(mockUser);
                }
            })
        );
    }

    // Delete user
    deleteUser(id: number): Observable<void> {
        return this.apiService.delete<void>(`users/${id}`).pipe(
            catchError(error => {
                console.warn('API failed for delete user, using mock response:', error);
                this.mockStorage.deleteUser(id);
                return of(void 0); // Simulate successful deletion
            })
        );
    }

    // Get users by role
    getUsersByRole(role: string, params?: any): Observable<User[]> {
        return this.apiService.get<User[]>('users', { role, ...params }).pipe(
            catchError(error => {
                console.warn(`API failed for users with role ${role}, using mock data:`, error);
                return of(this.mockStorage.getUsersByRole(role));
            })
        );
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
