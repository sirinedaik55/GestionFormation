import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Promise<User[]> {
    return this.http.get<User[]>(this.apiUrl).toPromise().then(users => users ?? []);
  }

  updateUserTeam(userId: number, teamId: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/team`, { team_id: teamId });
  }
}
