import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { User, CreateUserRequest, UpdateUserRequest } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    private apiUrl = 'http://localhost:8000/api/users';

    constructor(private http: HttpClient) {}

    async getUsers(): Promise<User[]> {
        try {
            return await lastValueFrom(this.http.get<User[]>(this.apiUrl));
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    async getUsersByRole(role: string): Promise<User[]> {
        try {
            return await lastValueFrom(this.http.get<User[]>(`${this.apiUrl}?role=${role}`));
        } catch (error) {
            console.error('Error fetching users by role:', error);
            return [];
        }
    }

    createUser(user: CreateUserRequest): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    updateUser(id: number, user: UpdateUserRequest): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, user);
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    updateUserTeam(userId: number, teamId: number): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${userId}/team`, { team_id: teamId });
    }
}
