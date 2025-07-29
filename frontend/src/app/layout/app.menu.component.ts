import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from './service/app.layout.service';
import { SimpleAuthService } from '../services/simple-auth.service';


@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];

    constructor(
        public layoutService: LayoutService,
        private authService: SimpleAuthService,
        private router: Router
    ) { }

    ngOnInit() {
        const currentUser = this.authService.getCurrentUser();

        if (currentUser) {
            const userRole = currentUser.role;
            if (userRole === 'admin') {
                this.model = this.getAdminMenu();
            } else if (userRole === 'formateur') {
                this.model = this.getTrainerMenu();
            } else if (userRole === 'employe') {
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
        this.authService.logout();
    }


}