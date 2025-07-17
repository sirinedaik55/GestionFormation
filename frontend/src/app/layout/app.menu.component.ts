import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../services/auth.service';


@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.model = [
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

            /* ===== PRESERVED CODE FOR FUTURE TRAINER/EMPLOYEE MODULES =====

            // FOR TRAINER MODULE:
            {
                label: 'TRAINER TOOLS',
                items: [
                    { label: 'My Trainings', icon: 'pi pi-fw pi-briefcase', routerLink: ['/trainer/trainings'] },
                    { label: 'Attendance', icon: 'pi pi-fw pi-check-square', routerLink: ['/trainer/attendance'] },
                    { label: 'Materials', icon: 'pi pi-fw pi-file', routerLink: ['/trainer/materials'] }
                ]
            },

            // FOR EMPLOYEE MODULE:
            {
                label: 'MY LEARNING',
                items: [
                    { label: 'My Trainings', icon: 'pi pi-fw pi-calendar', routerLink: ['/employee/trainings'] },
                    { label: 'Progress', icon: 'pi pi-fw pi-chart-line', routerLink: ['/employee/progress'] },
                    { label: 'Certificates', icon: 'pi pi-fw pi-award', routerLink: ['/employee/certificates'] }
                ]
            },

            // UTILITY COMPONENTS (can be reused):
            { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
            { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
            { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] }

            ===== END PRESERVED CODE ===== */
        ];
    }

    logout() {
        console.log('🚪 Logout initiated...');

        // Clear session immediately for instant feedback
        this.clearLocalSession();

        // Try to logout from server (but don't wait for it)
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