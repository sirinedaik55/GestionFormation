import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { Formation } from '../models/formation.model';

@Injectable({ providedIn: 'root' })
export class FormationService {
  private apiUrl = 'http://localhost:8000/api/formations';

  constructor(private http: HttpClient) {}

  async getFormations(): Promise<Formation[]> {
    try {
      return await lastValueFrom(this.http.get<Formation[]>(this.apiUrl));
    } catch (error) {
      console.error('Error fetching formations:', error);
      return [];
    }
  }

  getFormation(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${id}`);
  }

  createFormation(formation: Partial<Formation>): Observable<Formation> {
    return this.http.post<Formation>(this.apiUrl, formation);
  }

  updateFormation(id: number, formation: Partial<Formation>): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${id}`, formation);
  }

  deleteFormation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
