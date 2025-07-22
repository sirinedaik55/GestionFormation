import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'trainer' | 'employee' | 'formateur' | 'employe';
    team_id?: number;
    team?: string;
    specialite?: string;
    phone?: string;
    status: string;
    date_debut?: string;
    date_fin?: string;
    room?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
        token_type: string;
    };
}

export interface RegisterRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'admin' | 'trainer' | 'employee' | 'formateur' | 'employe';
    team_id?: number;
    phone?: string;
    specialite?: string;
    date_debut?: string;
    date_fin?: string;
    room?: string;
}

export interface ChangePasswordRequest {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8000/api';
    private tokenKey = 'auth_token';
    private userKey = 'auth_user';

    private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    public currentUser$ = this.currentUserSubject.asObservable();

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        // Check token validity on service initialization
        this.checkTokenValidity();
    }

    /**
     * Login user
     */
    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials)
            .pipe(
                tap((response: any) => {
                    if (response.success) {
                        this.setSession(response.data);
                    }
                }),
                catchError(this.handleError)
            );
    }

    /**
     * Register new user (Admin only)
     */
    register(userData: RegisterRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/register`, userData, {
            headers: this.getAuthHeaders()
        }).pipe(catchError(this.handleError));
    }

    /**
     * Logout user
     */
    logout(): Observable<any> {
        console.log('🚪 AuthService logout called...');

        return this.http.post<any>(`${this.apiUrl}/auth/logout`, {}, {
            headers: this.getAuthHeaders()
        }).pipe(
            tap(() => {
                console.log('✅ Server logout successful');
                this.clearSessionData();
            }),
            catchError((error) => {
                console.error('❌ Server logout failed:', error);
                // Even if logout fails on server, clear local session data
                this.clearSessionData();
                return throwError('Logout failed');
            })
        );
    }

    /**
     * Logout from all devices
     */
    logoutAll(): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/logout-all`, {}, {
            headers: this.getAuthHeaders()
        }).pipe(
            tap(() => this.clearSession()),
            catchError(this.handleError)
        );
    }

    /**
     * Get current user info
     */
    getCurrentUser(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/auth/me`, {
            headers: this.getAuthHeaders()
        }).pipe(
            tap((response: any) => {
                if (response.success) {
                    this.updateUser(response.data.user);
                }
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Get user profile
     */
    getProfile(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/auth/profile`, {
            headers: this.getAuthHeaders()
        }).pipe(
            map((response: any) => response.data || response),
            catchError(() => {
                // Fallback to current user data
                return this.getCurrentUser().pipe(
                    map((response: any) => response.data?.user || response.user || response)
                );
            })
        );
    }

    /**
     * Update user profile
     */
    updateProfile(profileData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/auth/profile`, profileData, {
            headers: this.getAuthHeaders()
        }).pipe(
            map((response: any) => response.data || response),
            tap((updatedUser: any) => {
                // Update local user data
                this.updateUser(updatedUser);
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Change password
     */
    changePassword(passwordData: ChangePasswordRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/change-password`, passwordData, {
            headers: this.getAuthHeaders()
        }).pipe(catchError(this.handleError));
    }

    /**
     * Refresh token
     */
    refreshToken(): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/refresh`, {}, {
            headers: this.getAuthHeaders()
        }).pipe(
            tap((response: any) => {
                if (response.success) {
                    this.setToken(response.data.token);
                }
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return this.hasValidToken();
    }

    /**
     * Get current user
     */
    getCurrentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    /**
     * Check if user has specific role
     */
    hasRole(role: string): boolean {
        const user = this.getCurrentUserValue();
        return user ? user.role === role : false;
    }

    /**
     * Check if user has any of the specified roles
     */
    hasAnyRole(roles: string[]): boolean {
        const user = this.getCurrentUserValue();
        return user ? roles.includes(user.role) : false;
    }

    /**
     * Check if user is admin
     */
    isAdmin(): boolean {
        return this.hasRole('admin');
    }

    /**
     * Check if user is trainer
     */
    isTrainer(): boolean {
        return this.hasRole('trainer');
    }

    /**
     * Check if user is employee
     */
    isEmployee(): boolean {
        return this.hasRole('employee');
    }

    /**
     * Get auth token
     */
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Set session data
     */
    private setSession(authData: any): void {
        localStorage.setItem(this.tokenKey, authData.token);
        localStorage.setItem(this.userKey, JSON.stringify(authData.user));
        this.currentUserSubject.next(authData.user);
        this.isAuthenticatedSubject.next(true);
    }

    /**
     * Set token
     */
    private setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    /**
     * Update user data
     */
    private updateUser(user: User): void {
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    /**
     * Clear session data only (no navigation)
     */
    private clearSessionData(): void {
        console.log('🧹 Clearing session data...');

        // Remove specific keys
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);

        // Also remove any other auth-related keys
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        localStorage.removeItem('user_role');

        // Update subjects
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);

        console.log('✅ Session data cleared');
    }

    /**
     * Clear session and redirect (for error handling)
     */
    private clearSession(): void {
        this.clearSessionData();
        this.router.navigate(['/auth/login']);
    }

    /**
     * Get user from storage
     */
    private getUserFromStorage(): User | null {
        const userStr = localStorage.getItem(this.userKey);
        return userStr ? JSON.parse(userStr) : null;
    }

    /**
     * Check if token exists and is valid
     */
    private hasValidToken(): boolean {
        const token = this.getToken();
        return !!token; // In a real app, you might want to check token expiration
    }

    /**
     * Check token validity with server
     */
    private checkTokenValidity(): void {
        if (this.hasValidToken()) {
            this.getCurrentUser().subscribe({
                next: () => {
                    // Token is valid
                },
                error: () => {
                    // Token is invalid, clear session
                    this.clearSession();
                }
            });
        }
    }

    /**
     * Get authorization headers
     */
    private getAuthHeaders(): HttpHeaders {
        const token = this.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    /**
     * Handle HTTP errors
     */
    private handleError = (error: any) => {
        console.error('Auth Service Error:', error);
        
        if (error.status === 401) {
            this.clearSession();
        }
        
        return throwError(error);
    };

    /**
     * Redirect user based on role after login
     */
    redirectAfterLogin(): void {
        const user = this.getCurrentUserValue();
        if (!user) return;

        switch (user.role) {
            case 'admin':
                this.router.navigate(['/']);
                break;
            case 'trainer':
            case 'formateur':
                this.router.navigate(['/trainer']);
                break;
            case 'employee':
            case 'employe':
                this.router.navigate(['/employee']);
                break;
            default:
                this.router.navigate(['/']);
        }
    }
}
