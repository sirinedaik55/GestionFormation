import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: any;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'http://localhost:8000/api';

    constructor(private http: HttpClient) {}

    getApiUrl(): string {
        return this.apiUrl;
    }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken');
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    private handleError(error: any): Observable<never> {
        console.error('API Error:', error);
        return throwError(error);
    }

    // Generic HTTP methods
    get<T>(endpoint: string, params?: any): Observable<T> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    httpParams = httpParams.set(key, params[key].toString());
                }
            });
        }

        return this.http.get<T>(`${this.apiUrl}/${endpoint}`, {
            headers: this.getHeaders(),
            params: httpParams
        }).pipe(
            catchError(this.handleError)
        );
    }

    post<T>(endpoint: string, data: any): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    put<T>(endpoint: string, data: any): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    // File upload
    uploadFile<T>(endpoint: string, file: File, additionalData?: any): Observable<T> {
        const formData = new FormData();
        formData.append('file', file);
        
        if (additionalData) {
            Object.keys(additionalData).forEach(key => {
                formData.append(key, additionalData[key]);
            });
        }

        const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken');
        let headers = new HttpHeaders();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return this.http.post<T>(`${this.apiUrl}/${endpoint}`, formData, {
            headers: headers
        }).pipe(
            catchError(this.handleError)
        );
    }

    // Download file
    downloadFile(endpoint: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${endpoint}`, {
            headers: this.getHeaders(),
            responseType: 'blob'
        }).pipe(
            catchError(this.handleError)
        );
    }
}
