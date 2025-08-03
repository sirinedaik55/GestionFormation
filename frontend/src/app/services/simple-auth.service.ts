import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { catchError, tap, map } from 'rxjs/operators';

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
        // Admin Users
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
            first_name: 'Sarah',
            last_name: 'Manager',
            email: 'sarah.manager@formation.com',
            role: 'admin',
            phone: '+33123456788'
        },

        // Trainers/Formateurs
        {
            id: 3,
            first_name: 'Syrine',
            last_name: 'Daik',
            email: 'trainer@formation.com',
            role: 'formateur',
            specialite: 'Angular & TypeScript',
            phone: '+33123456790'
        },
        {
            id: 4,
            first_name: 'Marie',
            last_name: 'Martin',
            email: 'marie.martin@formation.com',
            role: 'formateur',
            specialite: 'Data Science & Python',
            phone: '+33123456791'
        },
        {
            id: 5,
            first_name: 'Pierre',
            last_name: 'Dubois',
            email: 'pierre.dubois@formation.com',
            role: 'formateur',
            specialite: 'Project Management',
            phone: '+33123456792'
        },
        {
            id: 6,
            first_name: 'Sophie',
            last_name: 'Laurent',
            email: 'sophie.laurent@formation.com',
            role: 'formateur',
            specialite: 'Digital Marketing',
            phone: '+33123456793'
        },
        {
            id: 7,
            first_name: 'Thomas',
            last_name: 'Bernard',
            email: 'thomas.bernard@formation.com',
            role: 'formateur',
            specialite: 'Cybersecurity',
            phone: '+33123456794'
        },

        // Employees/Employés
        {
            id: 8,
            first_name: 'John',
            last_name: 'Doe',
            email: 'employee@formation.com',
            role: 'employe',
            team: 'Development Team',
            phone: '+33987654321'
        },
        {
            id: 9,
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@formation.com',
            role: 'employe',
            team: 'Data Science Team',
            phone: '+33987654322'
        },
        {
            id: 10,
            first_name: 'Mike',
            last_name: 'Johnson',
            email: 'mike.johnson@formation.com',
            role: 'employe',
            team: 'Marketing Team',
            phone: '+33987654323'
        },
        {
            id: 11,
            first_name: 'Sarah',
            last_name: 'Wilson',
            email: 'sarah.wilson@formation.com',
            role: 'employe',
            team: 'Design Team',
            phone: '+33987654324'
        },
        {
            id: 12,
            first_name: 'David',
            last_name: 'Brown',
            email: 'david.brown@formation.com',
            role: 'employe',
            team: 'Security Team',
            phone: '+33987654325'
        },
        {
            id: 13,
            first_name: 'Emma',
            last_name: 'Davis',
            email: 'emma.davis@formation.com',
            role: 'employe',
            team: 'Development Team',
            phone: '+33987654326'
        },
        {
            id: 14,
            first_name: 'Lucas',
            last_name: 'Garcia',
            email: 'lucas.garcia@formation.com',
            role: 'employe',
            team: 'Data Science Team',
            phone: '+33987654327'
        },
        {
            id: 15,
            first_name: 'Olivia',
            last_name: 'Martinez',
            email: 'olivia.martinez@formation.com',
            role: 'employe',
            team: 'Marketing Team',
            phone: '+33987654328'
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
        // Removed auto-login to allow manual role selection
    }

    login(credentials: LoginRequest): Observable<any> {
        console.log('SimpleAuthService.login called with:', credentials);

        // Use real API for authentication
        return this.http.post(`${this.apiService.getApiUrl()}/auth/login`, credentials)
            .pipe(
                map((response: any) => {
                    console.log('API login response:', response);

                    if (response.success && (response.user || response.data)) {
                        // Get user data from response.user or response.data
                        const userData = response.user || response.data;

                        // Store user and token
                        localStorage.setItem('currentUser', JSON.stringify(userData));
                        localStorage.setItem('authToken', response.access_token || response.token || 'api-token');

                        // Update subjects
                        this.currentUserSubject.next(userData);
                        this.isAuthenticatedSubject.next(true);

                        console.log('✅ Login successful, user data:', userData);

                        return {
                            success: true,
                            message: response.message || `Welcome ${userData.first_name} ${userData.last_name}!`,
                            user: userData
                        };
                    } else {
                        console.log('❌ Login failed, response:', response);
                        return {
                            success: false,
                            message: response.message || 'Login failed'
                        };
                    }
                }),
                catchError((error) => {
                    console.error('Login API error:', error);

                    let errorMessage = 'Login failed';
                    if (error.error && error.error.message) {
                        errorMessage = error.error.message;
                    } else if (error.status === 401) {
                        errorMessage = 'Invalid credentials';
                    } else if (error.status === 0) {
                        errorMessage = 'Cannot connect to server';
                    }

                    return of({
                        success: false,
                        message: errorMessage
                    });
                })
            );
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
                this.router.navigate(['/dashboard']);
                break;
            case 'formateur':
                this.router.navigate(['/dashboard']);
                break;
            case 'employe':
                this.router.navigate(['/dashboard']);
                break;
            default:
                this.router.navigate(['/dashboard']);
        }
    }

    // Methods for testing different roles
    switchToAdmin(): void {
        const adminUser = this.mockUsers.find(u => u.role === 'admin');
        if (adminUser) {
            localStorage.setItem('currentUser', JSON.stringify(adminUser));
            localStorage.setItem('authToken', 'mock-admin-token');
            this.currentUserSubject.next(adminUser);
            this.isAuthenticatedSubject.next(true);
            this.router.navigate(['/dashboard']);
        }
    }

    switchToTrainer(): void {
        const trainerUser = this.mockUsers.find(u => u.role === 'formateur');
        if (trainerUser) {
            localStorage.setItem('currentUser', JSON.stringify(trainerUser));
            localStorage.setItem('authToken', 'mock-trainer-token');
            this.currentUserSubject.next(trainerUser);
            this.isAuthenticatedSubject.next(true);
            this.router.navigate(['/dashboard']);
        }
    }

    switchToEmployee(): void {
        const employeeUser = this.mockUsers.find(u => u.role === 'employe');
        if (employeeUser) {
            localStorage.setItem('currentUser', JSON.stringify(employeeUser));
            localStorage.setItem('authToken', 'mock-employee-token');
            this.currentUserSubject.next(employeeUser);
            this.isAuthenticatedSubject.next(true);
            this.router.navigate(['/dashboard']);
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
            // If no user is logged in, return an error
            return throwError(() => new Error('No user logged in'));
        }

        const endpoint = user.role === 'employe' ? 'test/employee/profile' :
                        user.role === 'formateur' ? 'test/trainer/profile' :
                        'test/auth/me';

        return this.apiService.get<SimpleUser>(endpoint).pipe(
            tap(profile => {
                // Update the stored user with the profile data
                const updatedUser = { ...user, ...profile };
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                this.currentUserSubject.next(updatedUser);
            }),
            catchError((error) => {
                console.error('Profile API failed, using current user:', error);
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
