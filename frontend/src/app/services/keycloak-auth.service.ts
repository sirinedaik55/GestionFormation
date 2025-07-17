import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface KeycloakUser {
    id: string;
    username: string;
    email: string;
    name: string;
    first_name: string;
    last_name: string;
    roles: string[];
    team?: string;
    phone?: string;
    specialite?: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
        user: KeycloakUser;
    };
}

export interface KeycloakConfig {
    keycloak_url: string;
    realm: string;
    client_id: string;
    auth_url: string;
    token_url: string;
    userinfo_url: string;
    logout_url: string;
}

@Injectable({
    providedIn: 'root'
})
export class KeycloakAuthService {
    private apiUrl = 'http://localhost:8000/api';
    private accessTokenKey = 'keycloak_access_token';
    private refreshTokenKey = 'keycloak_refresh_token';
    private userKey = 'keycloak_user';

    private currentUserSubject = new BehaviorSubject<KeycloakUser | null>(this.getUserFromStorage());
    public currentUser$ = this.currentUserSubject.asObservable();

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    private keycloakConfig: KeycloakConfig | null = null;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        // Initialize will be called by AppInitService
    }

    /**
     * Initialize authentication service
     */
    async initializeAuth(): Promise<void> {
        await this.loadKeycloakConfig();
        this.checkExistingAuth();
    }

    /**
     * Load Keycloak configuration from backend
     */
    private async loadKeycloakConfig(): Promise<void> {
        try {
            // Try regular Keycloak config first
            let response = await fetch(`${this.apiUrl}/auth/config`);
            let data = await response.json();

            if (data.success) {
                this.keycloakConfig = data.data;
                return;
            }
        } catch (error) {
            console.warn('Failed to load Keycloak config, trying mock config:', error);
        }

        try {
            // Fallback to mock config
            const response = await fetch(`${this.apiUrl}/auth/mock/config`);
            const data = await response.json();
            if (data.success) {
                this.keycloakConfig = data.data;
                console.log('Using mock authentication configuration');
            }
        } catch (error) {
            console.error('Failed to load mock config:', error);
        }
    }

    /**
     * Check if user is already authenticated on app start
     */
    private checkExistingAuth(): void {
        const token = this.getAccessToken();
        const userStr = localStorage.getItem('keycloak_user');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                this.currentUserSubject.next(user);
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                this.clearStoredTokens();
            }
        }
    }

    /**
     * Clear stored tokens and user data
     */
    private clearStoredTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem('keycloak_user');
        this.currentUserSubject.next(null);
    }

    /**
     * Login with username and password
     */
    login(credentials: LoginRequest): Observable<LoginResponse> {
        // Try regular Keycloak login first, then fallback to mock
        return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
            .pipe(
                tap(response => {
                    if (response.success) {
                        this.setSession(response.data);
                    }
                }),
                catchError(error => {
                    console.warn('Keycloak login failed, trying mock login:', error);
                    // Fallback to mock login
                    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/mock/login`, credentials)
                        .pipe(
                            tap(response => {
                                if (response.success) {
                                    this.setSession(response.data);
                                }
                            }),
                            catchError(this.handleError)
                        );
                })
            );
    }

    /**
     * Refresh access token
     */
    refreshToken(): Observable<any> {
        const refreshToken = this.getRefreshToken();
        
        if (!refreshToken) {
            return throwError('No refresh token available');
        }

        return this.http.post(`${this.apiUrl}/auth/refresh`, {
            refresh_token: refreshToken
        }).pipe(
            tap((response: any) => {
                if (response.success) {
                    this.setTokens(response.data.access_token, response.data.refresh_token);
                }
            }),
            catchError(error => {
                this.clearSession();
                return throwError(error);
            })
        );
    }

    /**
     * Logout user
     */
    logout(): Observable<any> {
        const refreshToken = this.getRefreshToken();
        
        const logoutRequest = refreshToken ? 
            this.http.post(`${this.apiUrl}/auth/logout`, { refresh_token: refreshToken }) :
            new Observable(observer => observer.next({}));

        return logoutRequest.pipe(
            tap(() => this.clearSession()),
            catchError(() => {
                this.clearSession();
                return throwError('Logout failed');
            })
        );
    }

    /**
     * Get current user info from server
     */
    getCurrentUser(): Observable<any> {
        return this.http.get(`${this.apiUrl}/auth/me`, {
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
     * Validate current token
     */
    validateToken(): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/validate`, {}, {
            headers: this.getAuthHeaders()
        }).pipe(
            tap((response: any) => {
                if (response.success) {
                    this.updateUser(response.data.user);
                }
            }),
            catchError(error => {
                this.clearSession();
                return throwError(error);
            })
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
    getCurrentUserValue(): KeycloakUser | null {
        return this.currentUserSubject.value;
    }

    /**
     * Check if user has specific role
     */
    hasRole(role: string): boolean {
        const user = this.getCurrentUserValue();
        return user ? user.roles.includes(role) : false;
    }

    /**
     * Check if user has any of the specified roles
     */
    hasAnyRole(roles: string[]): boolean {
        const user = this.getCurrentUserValue();
        return user ? roles.some(role => user.roles.includes(role)) : false;
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
     * Get access token
     */
    getAccessToken(): string | null {
        return localStorage.getItem(this.accessTokenKey);
    }

    /**
     * Get refresh token
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey);
    }

    /**
     * Get Keycloak configuration
     */
    getKeycloakConfig(): KeycloakConfig | null {
        return this.keycloakConfig;
    }

    /**
     * Set session data
     */
    private setSession(authData: any): void {
        localStorage.setItem(this.accessTokenKey, authData.access_token);
        localStorage.setItem(this.refreshTokenKey, authData.refresh_token);
        localStorage.setItem(this.userKey, JSON.stringify(authData.user));
        this.currentUserSubject.next(authData.user);
        this.isAuthenticatedSubject.next(true);
    }

    /**
     * Set tokens only
     */
    private setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    /**
     * Update user data
     */
    private updateUser(user: KeycloakUser): void {
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    /**
     * Clear session
     */
    private clearSession(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/auth/login']);
    }

    /**
     * Get user from storage
     */
    private getUserFromStorage(): KeycloakUser | null {
        const userStr = localStorage.getItem(this.userKey);
        return userStr ? JSON.parse(userStr) : null;
    }

    /**
     * Check if token exists
     */
    private hasValidToken(): boolean {
        const token = this.getAccessToken();
        return !!token;
    }

    /**
     * Get authorization headers
     */
    private getAuthHeaders(): HttpHeaders {
        const token = this.getAccessToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    /**
     * Handle HTTP errors
     */
    private handleError = (error: any) => {
        console.error('Keycloak Auth Service Error:', error);
        
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

        // Check if there's an attempted URL to redirect to
        const attemptedUrl = localStorage.getItem('attempted_url');
        if (attemptedUrl) {
            localStorage.removeItem('attempted_url');
            this.router.navigateByUrl(attemptedUrl);
            return;
        }

        // Default role-based redirection
        if (user.roles.includes('admin')) {
            this.router.navigate(['/']);
        } else if (user.roles.includes('trainer')) {
            this.router.navigate(['/trainer/dashboard']);
        } else if (user.roles.includes('employee')) {
            this.router.navigate(['/employee/dashboard']);
        } else {
            this.router.navigate(['/']);
        }
    }
}
