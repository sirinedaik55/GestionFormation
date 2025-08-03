import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
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
    email: string;
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
    } | null;
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

    // Mock users for fallback authentication
    private mockUsers: KeycloakUser[] = [
        {
            id: '1',
            username: 'admin',
            email: 'admin@formation.com',
            name: 'Admin User',
            first_name: 'Admin',
            last_name: 'User',
            roles: ['admin'],
            team: 'Administration'
        },
        {
            id: '2',
            username: 'trainer',
            email: 'trainer@formation.com',
            name: 'Syrine Daik',
            first_name: 'Syrine',
            last_name: 'Daik',
            roles: ['formateur', 'trainer'],
            team: 'Trainers'
        },
        {
            id: '3',
            username: 'employee',
            email: 'employee@formation.com',
            name: 'John Doe',
            first_name: 'John',
            last_name: 'Doe',
            roles: ['employe', 'employee'],
            team: 'Development Team'
        }
    ];

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
        try {
            await this.loadKeycloakConfig();
        } catch (error) {
            console.warn('Failed to load Keycloak config, using fallback mode:', error);
        }
        this.checkExistingAuth();
    }

    /**
     * Load Keycloak configuration from backend
     */
    private async loadKeycloakConfig(): Promise<void> {
        try {
            // Try regular Keycloak config first with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            let response = await fetch(`${this.apiUrl}/auth/config`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            let data = await response.json();

            if (data.success) {
                this.keycloakConfig = data.data;
                return;
            }
        } catch (error) {
            console.warn('Failed to load Keycloak config, trying mock config:', error);
        }

        try {
            // Fallback to mock config with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

            const response = await fetch(`${this.apiUrl}/auth/mock/config`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await response.json();
            if (data.success) {
                this.keycloakConfig = data.data;
                console.log('Using mock authentication configuration');
            }
        } catch (error) {
            console.warn('Failed to load mock config, using local fallback:', error);
            // Set a basic mock config
            this.keycloakConfig = {
                keycloak_url: 'http://localhost:8080',
                realm: 'formation',
                client_id: 'formation-app',
                auth_url: 'http://localhost:8080/auth',
                token_url: 'http://localhost:8080/token',
                userinfo_url: 'http://localhost:8080/userinfo',
                logout_url: 'http://localhost:8080/logout'
            };
        }
    }

    /**
     * Check if user is already authenticated on app start
     */
    private checkExistingAuth(): void {
        console.log('🔍 KeycloakAuthService: Checking existing auth...');

        const token = this.getAccessToken();
        const userStr = localStorage.getItem('keycloak_user');

        console.log('🔍 KeycloakAuthService: Token exists:', !!token);
        console.log('🔍 KeycloakAuthService: User string exists:', !!userStr);

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                console.log('🔍 KeycloakAuthService: Restored user:', user);
                this.currentUserSubject.next(user);
                this.isAuthenticatedSubject.next(true);
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                this.clearStoredTokens();
            }
        } else {
            console.log('🔍 KeycloakAuthService: No existing auth found');
            this.isAuthenticatedSubject.next(false);
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
                    if (response.success && response.data) {
                        this.setSession(response.data);
                    }
                }),
                catchError(error => {
                    console.warn('Keycloak login failed, trying mock login:', error);
                    // Fallback to mock login
                    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/mock/login`, credentials)
                        .pipe(
                            tap(response => {
                                if (response.success && response.data) {
                                    this.setSession(response.data);
                                }
                            }),
                            catchError(mockError => {
                                console.warn('Mock API login failed, using local mock:', mockError);
                                // Final fallback to local mock
                                return this.mockLogin(credentials);
                            })
                        );
                })
            );
    }

    /**
     * Local mock login fallback
     */
    private mockLogin(credentials: LoginRequest): Observable<LoginResponse> {
        const user = this.mockUsers.find(u => u.email === credentials.email);

        if (user && credentials.password) {
            // Generate mock tokens
            const mockToken = 'mock-jwt-token-' + user.id;
            const mockRefreshToken = 'mock-refresh-token-' + user.id;

            const loginData = {
                user: user,
                access_token: mockToken,
                refresh_token: mockRefreshToken,
                expires_in: 3600,
                token_type: 'Bearer'
            };

            // Set session
            this.setSession(loginData);

            return of({
                success: true,
                message: 'Login successful (local mock)',
                data: loginData
            });
        } else {
            return of({
                success: false,
                message: 'Invalid credentials',
                data: null
            });
        }
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
        console.log('Setting session with data:', authData);
        localStorage.setItem(this.accessTokenKey, authData.access_token);
        localStorage.setItem(this.refreshTokenKey, authData.refresh_token);
        localStorage.setItem(this.userKey, JSON.stringify(authData.user));
        this.currentUserSubject.next(authData.user);
        this.isAuthenticatedSubject.next(true);
        console.log('Session set, current user:', this.getCurrentUserValue());
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

        // Don't automatically clear session on 401 errors
        // Let the component handle authorization errors

        return throwError(error);
    };

    /**
     * Redirect user based on role after login
     */
    redirectAfterLogin(): void {
        const user = this.getCurrentUserValue();
        console.log('Redirecting after login, user:', user);

        if (!user) {
            console.error('No user found for redirection');
            return;
        }

        // Check if there's an attempted URL to redirect to
        const attemptedUrl = localStorage.getItem('attempted_url');
        if (attemptedUrl) {
            localStorage.removeItem('attempted_url');
            console.log('Redirecting to attempted URL:', attemptedUrl);
            this.router.navigateByUrl(attemptedUrl);
            return;
        }

        // Default role-based redirection
        console.log('User roles:', user.roles);
        if (user.roles.includes('admin')) {
            console.log('Redirecting admin to /dashboard');
            this.router.navigate(['/dashboard']);
        } else if (user.roles.includes('trainer') || user.roles.includes('formateur')) {
            console.log('Redirecting trainer to /dashboard/trainer');
            this.router.navigate(['/dashboard/trainer']);
        } else if (user.roles.includes('employee') || user.roles.includes('employe')) {
            console.log('Redirecting employee to /dashboard/employee');
            this.router.navigate(['/dashboard/employee']);
        } else {
            console.log('Redirecting to default /dashboard');
            this.router.navigate(['/dashboard']);
        }
    }
}
