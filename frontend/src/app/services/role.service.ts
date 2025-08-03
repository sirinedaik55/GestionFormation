import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type UserRole = 'admin' | 'trainer' | 'employee';

export interface User {
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

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    private currentRoleSubject = new BehaviorSubject<UserRole | null>(null);

    public currentUser$ = this.currentUserSubject.asObservable();
    public currentRole$ = this.currentRoleSubject.asObservable();

    constructor() {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage() {
        try {
            // Try to load user from localStorage
            const storedUser = localStorage.getItem('keycloak_user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                this.setCurrentUser(user);
                console.log('🔧 RoleService: Loaded user from storage:', user);
            } else {
                console.log('🔧 RoleService: No user found in storage');
            }
        } catch (error) {
            console.error('🔧 RoleService: Error loading user from storage:', error);
        }
    }

    setCurrentUser(user: User | null) {
        this.currentUserSubject.next(user);
        
        if (user) {
            const role = this.determineUserRole(user);
            this.currentRoleSubject.next(role);
            console.log('🔧 RoleService: User role determined as:', role);
        } else {
            this.currentRoleSubject.next(null);
        }
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    getCurrentRole(): UserRole | null {
        return this.currentRoleSubject.value;
    }

    private determineUserRole(user: User): UserRole {
        if (!user.roles || user.roles.length === 0) {
            console.warn('🔧 RoleService: User has no roles, defaulting to employee');
            return 'employee';
        }

        // Check for admin role first (highest priority)
        if (user.roles.includes('admin') || user.roles.includes('administrator')) {
            return 'admin';
        }

        // Check for trainer/formateur role
        if (user.roles.includes('trainer') || user.roles.includes('formateur')) {
            return 'trainer';
        }

        // Default to employee
        return 'employee';
    }

    hasRole(role: UserRole): boolean {
        const currentRole = this.getCurrentRole();
        return currentRole === role;
    }

    hasAnyRole(roles: UserRole[]): boolean {
        const currentRole = this.getCurrentRole();
        return currentRole ? roles.includes(currentRole) : false;
    }

    isAdmin(): boolean {
        return this.hasRole('admin');
    }

    isTrainer(): boolean {
        return this.hasRole('trainer');
    }

    isEmployee(): boolean {
        return this.hasRole('employee');
    }

    // Mock login methods for testing
    loginAsAdmin() {
        const adminUser: User = {
            id: '1',
            username: 'admin@formation.com',
            email: 'admin@formation.com',
            name: 'Administrator',
            first_name: 'Admin',
            last_name: 'User',
            roles: ['admin'],
            team: 'Administration'
        };
        
        localStorage.setItem('keycloak_user', JSON.stringify(adminUser));
        this.setCurrentUser(adminUser);
        console.log('🔧 RoleService: Logged in as admin');
    }

    loginAsTrainer() {
        const trainerUser: User = {
            id: '2',
            username: 'trainer@formation.com',
            email: 'trainer@formation.com',
            name: 'Trainer User',
            first_name: 'Trainer',
            last_name: 'User',
            roles: ['trainer'],
            team: 'Formation',
            specialite: 'Informatique'
        };
        
        localStorage.setItem('keycloak_user', JSON.stringify(trainerUser));
        this.setCurrentUser(trainerUser);
        console.log('🔧 RoleService: Logged in as trainer');
    }

    loginAsEmployee() {
        const employeeUser: User = {
            id: '3',
            username: 'employee@formation.com',
            email: 'employee@formation.com',
            name: 'Employee User',
            first_name: 'Employee',
            last_name: 'User',
            roles: ['employee'],
            team: 'Development'
        };
        
        localStorage.setItem('keycloak_user', JSON.stringify(employeeUser));
        this.setCurrentUser(employeeUser);
        console.log('🔧 RoleService: Logged in as employee');
    }

    logout() {
        localStorage.removeItem('keycloak_user');
        localStorage.removeItem('keycloak_access_token');
        localStorage.removeItem('keycloak_refresh_token');
        this.setCurrentUser(null);
        console.log('🔧 RoleService: User logged out');
    }
}
