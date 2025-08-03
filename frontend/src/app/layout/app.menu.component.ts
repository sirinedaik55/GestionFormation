import { OnInit, OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from './service/app.layout.service';
import { SimpleAuthService } from '../services/simple-auth.service';
import { RoleService } from '../services/role.service';
import { TranslationService } from '../services/translation.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit, OnDestroy {
    model: any[] = [];
    private userSubscription?: Subscription;
    private languageSubscription?: Subscription;

    constructor(
        public layoutService: LayoutService,
        private authService: SimpleAuthService,
        private roleService: RoleService,
        private translationService: TranslationService,
        private router: Router
    ) { }

    ngOnInit() {
        console.log('🔧 AppMenuComponent: Initializing menu...');

        // Subscribe to user changes
        this.userSubscription = this.authService.currentUser$.subscribe(user => {
            this.buildMenuForUser(user);
        });

        // Subscribe to language changes to rebuild menu
        this.languageSubscription = this.translationService.currentLanguage$.subscribe(() => {
            const currentUser = this.authService.getCurrentUser();
            this.buildMenuForUser(currentUser);
        });
    }

    private buildMenuForUser(user: any) {
        console.log('🔧 AppMenuComponent: Building menu for user:', user);

        let userRole = 'admin'; // default
        if (user && user.role) {
            // Map SimpleAuthService roles to menu roles
            if (user.role === 'admin') {
                userRole = 'admin';
            } else if (user.role === 'formateur') {
                userRole = 'trainer';
            } else if (user.role === 'employe') {
                userRole = 'employee';
            }
        }

        console.log('🔧 AppMenuComponent: Mapped role:', userRole);

        if (userRole === 'admin') {
            this.model = this.getAdminMenu();
            console.log('🔧 AppMenuComponent: Loading admin menu');
        } else if (userRole === 'trainer') {
            this.model = this.getTrainerMenu();
            console.log('🔧 AppMenuComponent: Loading trainer menu');
        } else if (userRole === 'employee') {
            this.model = this.getEmployeeMenu();
            console.log('🔧 AppMenuComponent: Loading employee menu');
        } else {
            // Default to admin menu for testing
            this.model = this.getAdminMenu();
            console.log('🔧 AppMenuComponent: No role detected, defaulting to admin menu');
        }
    }

    ngOnDestroy() {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        if (this.languageSubscription) {
            this.languageSubscription.unsubscribe();
        }
    }

    private getAdminMenu(): any[] {
        return [
            // ===== ADMIN MENU =====
            {
                label: 'HOME',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }
                ]
            },
            {
                label: 'MANAGEMENT',
                items: [
                    {
                        label: 'User Management', icon: 'pi pi-fw pi-users',
                        items: [
                            { label: 'All Users', icon: 'pi pi-fw pi-users', routerLink: ['/dashboard/users'] },
                            { label: 'Employees', icon: 'pi pi-fw pi-user', routerLink: ['/dashboard/uikit/crud/employees'] },
                            { label: 'Trainers', icon: 'pi pi-fw pi-user-edit', routerLink: ['/dashboard/uikit/crud/trainers'] },
                            { label: 'Teams', icon: 'pi pi-fw pi-sitemap', routerLink: ['/dashboard/uikit/crud/teams'] }
                        ]
                    },
                    {
                        label: 'Training Management', icon: 'pi pi-fw pi-briefcase',
                        items: [
                            { label: 'Create Training', icon: 'pi pi-fw pi-plus', routerLink: ['/dashboard/uikit/formlayout'] },
                            { label: 'All Trainings', icon: 'pi pi-fw pi-list', routerLink: ['/dashboard/uikit/listtrain'] }
                        ]
                    }
                ]
            },
            {
                label: 'ANALYTICS',
                items: [
                    { label: 'Statistics', icon: 'pi pi-fw pi-chart-line', routerLink: ['/dashboard/uikit/statistics'] },
                    { label: 'Charts', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/dashboard/uikit/charts'] }
                ]
            },
            {
                label: 'SYSTEM',
                items: [
                    { label: 'Discussion Panel', icon: 'pi pi-fw pi-comments', routerLink: ['/dashboard/uikit/panel'] },
                    { label: 'Documents', icon: 'pi pi-fw pi-file', routerLink: ['/dashboard/uikit/documents'] },
                    { label: 'Reports', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/dashboard/uikit/reports'] },
                    { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: ['/dashboard/uikit/settings'] }
                ]
            },
            {
                label: 'ACCOUNT',
                items: [
                    { label: 'Profile', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/uikit/profile'] },
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
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }
                ]
            },
            {
                label: 'MY FORMATIONS',
                items: [
                    { label: 'My Formations', icon: 'pi pi-fw pi-briefcase', routerLink: ['/dashboard/trainer/formations'] },
                    { label: 'Calendar', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/trainer/formations/calendar'] }
                ]
            },
            {
                label: 'ATTENDANCE',
                items: [
                    { label: 'Take Attendance', icon: 'pi pi-fw pi-check-square', routerLink: ['/dashboard/trainer/attendance'] },
                    { label: 'Attendance History', icon: 'pi pi-fw pi-history', routerLink: ['/dashboard/trainer/attendance/history'] }
                ]
            },
            {
                label: 'DOCUMENTS',
                items: [
                    { label: 'My Documents', icon: 'pi pi-fw pi-file', routerLink: ['/dashboard/trainer/documents'] }
                ]
            },
            {
                label: 'REPORTS',
                items: [
                    { label: 'Formation Reports', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/dashboard/trainer/reports'] }
                ]
            },
            {
                label: 'ACCOUNT',
                items: [
                    { label: 'Profile', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/trainer/profile'] },
                    { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: ['/dashboard/trainer/profile/settings'] },
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
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }
                ]
            },
            {
                label: 'MY LEARNING',
                items: [
                    { label: 'My Formations', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/employee/formations'] },
                    { label: 'Formation History', icon: 'pi pi-fw pi-history', routerLink: ['/dashboard/employee/history'] }
                ]
            },
            {
                label: 'RESOURCES',
                items: [
                    { label: 'Documents', icon: 'pi pi-fw pi-file', routerLink: ['/dashboard/employee/documents'] }
                ]
            },
            {
                label: 'ACCOUNT',
                items: [
                    { label: 'Profile', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/employee/profile'] },
                    { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: ['/dashboard/employee/profile/settings'] },
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