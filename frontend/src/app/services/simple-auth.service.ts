import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { catchError, tap } from 'rxjs/operators';

export interface SimpleUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    team?: string;
    phone?: string;
    specialite?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class SimpleAuthService {
    private currentUserSubject = new BehaviorSubject<SimpleUser | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    // Mock users for testing
    private mockUsers: SimpleUser[] = [
        {
            id: 1,
            first_name: 'Admin',
            last_name: 'User',
            email: 'admin@formation.com',
            role: 'admin',
            phone: '+33123456789'
        },
        {
            id: 2,
            first_name: 'Syrine',
            last_name: 'Daik',
            email: 'trainer@formation.com',
            role: 'formateur',
            specialite: 'Angular & TypeScript',
            phone: '+33123456789'
        },
        {
            id: 3,
            first_name: 'John',
            last_name: 'Doe',
            email: 'employee@formation.com',
            role: 'employe',
            team: 'Development Team',
            phone: '+33987654321'
        }
    ];

    constructor(
        private http: HttpClient,
        private router: Router,
        private apiService: ApiService
    ) {
        // Check if user is already logged in
        this.checkStoredAuth();
    }

    private checkStoredAuth() {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
        }
    }

    login(credentials: LoginRequest): Observable<any> {
        // Mock login - find user by email
        const user = this.mockUsers.find(u => u.email === credentials.email);
        
        if (user) {
            // Store user in localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('authToken', 'mock-token-' + user.id);
            
            // Update subjects
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
            
            return of({
                success: true,
                message: 'Login successful',
                user: user
            });
        } else {
            return of({
                success: false,
                message: 'Invalid credentials'
            });
        }
    }

    logout(): void {
        // Clear localStorage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        
        // Update subjects
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        
        // Redirect to login
        this.router.navigate(['/auth/login']);
    }

    getCurrentUser(): SimpleUser | null {
        return this.currentUserSubject.value;
    }

    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }

    hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        return user ? user.role === role : false;
    }

    hasAnyRole(roles: string[]): boolean {
        const user = this.getCurrentUser();
        return user ? roles.includes(user.role) : false;
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    redirectAfterLogin(): void {
        const user = this.getCurrentUser();
        if (!user) return;

        switch (user.role) {
            case 'admin':
                this.router.navigate(['/']);
                break;
            case 'formateur':
                this.router.navigate(['/trainer']);
                break;
            case 'employe':
                this.router.navigate(['/employee']);
                break;
            default:
                this.router.navigate(['/']);
        }
    }

    // API-based methods
    loginWithAPI(credentials: LoginRequest): Observable<any> {
        return this.apiService.post<any>('auth/login', credentials).pipe(
            tap(response => {
                if (response.success && response.data) {
                    const user = response.data.user;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('authToken', response.data.token);
                    this.currentUserSubject.next(user);
                    this.isAuthenticatedSubject.next(true);
                }
            }),
            catchError(error => {
                console.warn('API login failed, using mock login');
                return this.login(credentials);
            })
        );
    }

    getProfile(): Observable<SimpleUser> {
        const user = this.getCurrentUser();
        if (!user) {
            return of(user as any);
        }

        const endpoint = user.role === 'employe' ? 'employee/profile' :
                        user.role === 'formateur' ? 'trainer/profile' :
                        'auth/me';

        return this.apiService.get<SimpleUser>(endpoint).pipe(
            tap(profile => {
                localStorage.setItem('currentUser', JSON.stringify(profile));
                this.currentUserSubject.next(profile);
            }),
            catchError(() => {
                // Return current user if API fails
                return of(user);
            })
        );
    }

    updateProfile(data: Partial<SimpleUser>): Observable<SimpleUser> {
        const user = this.getCurrentUser();
        if (!user) {
            return of(user as any);
        }

        const endpoint = user.role === 'employe' ? 'employee/profile' :
                        user.role === 'formateur' ? 'trainer/profile' :
                        'auth/profile';

        return this.apiService.put<SimpleUser>(endpoint, data).pipe(
            tap(updatedUser => {
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                this.currentUserSubject.next(updatedUser);
            }),
            catchError(() => {
                // Return current user if API fails
                return of(user);
            })
        );
    }
}
