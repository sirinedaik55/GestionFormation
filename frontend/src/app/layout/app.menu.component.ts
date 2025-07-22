import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../services/auth.service';
import { KeycloakAuthService } from '../services/keycloak-auth.service';


@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private keycloakAuthService: KeycloakAuthService,
        private router: Router
    ) { }

    ngOnInit() {
        // Try Keycloak user first, then fallback to regular auth
        const keycloakUser = this.keycloakAuthService.getCurrentUserValue();
        const authUser = this.authService.getCurrentUserValue();

        if (keycloakUser) {
            // Use Keycloak roles (array)
            if (keycloakUser.roles.includes('admin')) {
                this.model = this.getAdminMenu();
            } else if (keycloakUser.roles.includes('trainer') || keycloakUser.roles.includes('formateur')) {
                this.model = this.getTrainerMenu();
            } else if (keycloakUser.roles.includes('employee') || keycloakUser.roles.includes('employe')) {
                this.model = this.getEmployeeMenu();
            } else {
                this.model = this.getDefaultMenu();
            }
        } else if (authUser) {
            // Use regular auth role (string)
            const userRole = authUser.role;
            if (userRole === 'admin') {
                this.model = this.getAdminMenu();
            } else if (userRole === 'trainer' || userRole === 'formateur') {
                this.model = this.getTrainerMenu();
            } else if (userRole === 'employee' || userRole === 'employe') {
                this.model = this.getEmployeeMenu();
            } else {
                this.model = this.getDefaultMenu();
            }
        } else {
            this.model = this.getDefaultMenu();
        }
    }

    private getAdminMenu(): any[] {
        return [
            // ===== ADMIN MENU =====
            {
                label: 'HOME',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'MANAGEMENT',
                items: [
                    {
                        label: 'User Management', icon: 'pi pi-fw pi-users',
                        items: [
                            { label: 'Employees', icon: 'pi pi-fw pi-user', routerLink: ['/uikit/crud/employees'] },
                            { label: 'Trainers', icon: 'pi pi-fw pi-user-edit', routerLink: ['/uikit/crud/trainers'] },
                            { label: 'Teams', icon: 'pi pi-fw pi-sitemap', routerLink: ['/uikit/crud/teams'] }
                        ]
                    },
                    {
                        label: 'Training Management', icon: 'pi pi-fw pi-briefcase',
                        items: [
                            { label: 'Create Training', icon: 'pi pi-fw pi-plus', routerLink: ['/uikit/formlayout'] },
                            { label: 'All Trainings', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/listtrain'] }
                        ]
                    }
                ]
            },
            {
                label: 'ANALYTICS',
                items: [
                    { label: 'Statistics', icon: 'pi pi-fw pi-chart-line', routerLink: ['/uikit/statistics'] },
                    { label: 'Charts', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] }
                ]
            },
            {
                label: 'SYSTEM',
                items: [
                    { label: 'Discussion Panel', icon: 'pi pi-fw pi-comments', routerLink: ['/uikit/panel'] },
                    { label: 'Documents', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/documents'] },
                    { label: 'Reports', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/uikit/reports'] },
                    { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: ['/uikit/settings'] }
                ]
            },
            {
                label: 'ACCOUNT',
                items: [
                    { label: 'Profile', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/profile'] },
                    { label: 'Help', icon: 'pi pi-fw pi-question', routerLink: ['/pages/help'] },
                    { label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: () => this.logout() }
                ]
            }
        ];
    }

    private getTrainerMenu(): any[] {
        return [
            // ===== TRAINER MENU =====
            {
                label: 'HOME',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/trainer'] }
                ]
            },
            {
                label: 'MY FORMATIONS',
                items: [
                    { label: 'My Formations', icon: 'pi pi-fw pi-briefcase', routerLink: ['/trainer/formations'] },
                    { label: 'Calendar', icon: 'pi pi-fw pi-calendar', routerLink: ['/trainer/formations/calendar'] }
                ]
            },
            {
                label: 'ATTENDANCE',
                items: [
                    { label: 'Take Attendance', icon: 'pi pi-fw pi-check-square', routerLink: ['/trainer/attendance'] },
                    { label: 'Attendance History', icon: 'pi pi-fw pi-history', routerLink: ['/trainer/attendance/history'] }
                ]
            },
            {
                label: 'DOCUMENTS',
                items: [
                    { label: 'My Documents', icon: 'pi pi-fw pi-file', routerLink: ['/trainer/documents'] },
                    { label: 'Upload Materials', icon: 'pi pi-fw pi-upload', routerLink: ['/trainer/documents/upload'] }
                ]
            },
            {
                label: 'REPORTS',
                items: [
                    { label: 'Formation Reports', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/trainer/reports'] },
                    { label: 'Create Report', icon: 'pi pi-fw pi-plus', routerLink: ['/trainer/reports/create'] }
                ]
            },
            {
                label: 'ACCOUNT',
                items: [
                    { label: 'Profile', icon: 'pi pi-fw pi-id-card', routerLink: ['/trainer/profile'] },
                    { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: ['/trainer/profile/settings'] },
                    { label: 'Help', icon: 'pi pi-fw pi-question', routerLink: ['/pages/help'] },
                    { label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: () => this.logout() }
                ]
            }
        ];
    }

    private getEmployeeMenu(): any[] {
        return [
            // ===== EMPLOYEE MENU =====
            {
                label: 'HOME',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/employee'] }
                ]
            },
            {
                label: 'MY LEARNING',
                items: [
                    { label: 'My Formations', icon: 'pi pi-fw pi-calendar', routerLink: ['/employee/formations'] },
                    { label: 'Formation History', icon: 'pi pi-fw pi-history', routerLink: ['/employee/history'] }
                ]
            },
            {
                label: 'RESOURCES',
                items: [
                    { label: 'Documents', icon: 'pi pi-fw pi-file', routerLink: ['/employee/documents'] }
                ]
            },
            {
                label: 'ACCOUNT',
                items: [
                    { label: 'Profile', icon: 'pi pi-fw pi-id-card', routerLink: ['/employee/profile'] },
                    { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: ['/employee/profile/settings'] },
                    { label: 'Help', icon: 'pi pi-fw pi-question', routerLink: ['/pages/help'] },
                    { label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: () => this.logout() }
                ]
            }
        ];
    }

    private getDefaultMenu(): any[] {
        return [
            {
                label: 'ACCOUNT',
                items: [
                    { label: 'Login', icon: 'pi pi-fw pi-sign-in', routerLink: ['/auth/login'] },
                    { label: 'Help', icon: 'pi pi-fw pi-question', routerLink: ['/pages/help'] }
                ]
            }
        ];
    }

    logout() {
        console.log('🚪 Logout initiated...');

        // Clear session immediately for instant feedback
        this.clearLocalSession();

        // Try Keycloak logout first, then fallback to regular auth
        const keycloakUser = this.keycloakAuthService.getCurrentUserValue();

        if (keycloakUser) {
            this.keycloakAuthService.logout().subscribe({
                next: () => {
                    console.log('✅ Keycloak logout successful');
                    this.redirectToLogin();
                },
                error: (error) => {
                    console.error('❌ Keycloak logout failed, but continuing with local logout:', error);
                    this.redirectToLogin();
                }
            });
        } else {
            // Fallback to regular auth logout
            this.authService.logout().subscribe({
                next: () => {
                    console.log('✅ Server logout successful');
                    this.redirectToLogin();
                },
                error: (error) => {
                    console.error('❌ Server logout failed, but continuing with local logout:', error);
                    this.redirectToLogin();
                }
            });
        }
    }

    private clearLocalSession() {
        console.log('🧹 Clearing local session...');

        // Clear all possible auth-related localStorage items
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        localStorage.removeItem('user_role');

        // Clear any other auth data that might exist
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('auth') || key.includes('token') || key.includes('user'))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        console.log('✅ Local session cleared');
    }

    private redirectToLogin() {
        console.log('🔄 Redirecting to login...');

        this.router.navigate(['/auth/login']).then(() => {
            console.log('✅ Redirected to login page');
            // Force page reload to ensure completely clean state
            setTimeout(() => {
                window.location.reload();
            }, 100);
        });
    }
}