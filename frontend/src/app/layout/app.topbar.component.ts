import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LayoutService } from "./service/app.layout.service";
import { SimpleAuthService, SimpleUser } from '../services/simple-auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit, OnDestroy {

    items!: MenuItem[];
    currentUser: SimpleUser | null = null;
    private userSubscription?: Subscription;

    constructor(
        public layoutService: LayoutService,
        private authService: SimpleAuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.userSubscription = this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
            this.updateMenuItems();
        });
    }

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
    }

    private updateMenuItems(): void {
        if (this.currentUser) {
            this.items = [
                {
                    label: `${this.currentUser.first_name} ${this.currentUser.last_name}`,
                    icon: 'pi pi-user',
                    items: [
                        {
                            label: 'Profile',
                            icon: 'pi pi-user-edit',
                            command: (event) => {
                                console.log('🔧 Profile clicked');
                                this.goToProfile();
                            }
                        },
                        {
                            label: 'Settings',
                            icon: 'pi pi-cog',
                            command: (event) => {
                                console.log('🔧 Settings clicked');
                                this.goToSettings();
                            }
                        },
                        {
                            separator: true
                        },
                        {
                            label: 'Logout',
                            icon: 'pi pi-sign-out',
                            command: (event) => {
                                console.log('🔧 Logout clicked');
                                this.logout();
                            }
                        }
                    ]
                }
            ];
        }
    }

    private goToProfile(): void {
        console.log('🔧 goToProfile called');
        if (this.currentUser) {
            const role = this.currentUser.role;
            console.log('🔧 Current user role for profile:', role);

            if (role === 'admin') {
                console.log('🔧 Navigating to admin profile');
                this.router.navigate(['/dashboard/uikit/profile']);
            } else if (role === 'formateur') {
                console.log('🔧 Navigating to trainer profile');
                this.router.navigate(['/dashboard/trainer/profile']);
            } else if (role === 'employe') {
                console.log('🔧 Navigating to employee profile');
                this.router.navigate(['/dashboard/employee/profile']);
            } else {
                console.log('🔧 Navigating to default profile');
                this.router.navigate(['/dashboard/uikit/profile']);
            }
        } else {
            console.log('🔧 No current user found for profile');
        }
    }

    private goToSettings(): void {
        console.log('🔧 goToSettings called');
        if (this.currentUser) {
            const role = this.currentUser.role;
            console.log('🔧 Current user role:', role);
            if (role === 'admin') {
                console.log('🔧 Navigating to admin settings');
                this.router.navigate(['/dashboard/uikit/settings']);
            } else if (role === 'formateur') {
                console.log('🔧 Navigating to trainer settings');
                this.router.navigate(['/dashboard/trainer/settings']);
            } else if (role === 'employe') {
                console.log('🔧 Navigating to employee settings');
                this.router.navigate(['/dashboard/employee/settings']);
            } else {
                console.log('🔧 Navigating to default settings');
                this.router.navigate(['/dashboard/uikit/settings']);
            }
        } else {
            console.log('🔧 No current user found');
        }
    }

    logout(): void {
        this.authService.logout();
    }

    getRoleBadgeClass(): string {
        if (!this.currentUser) return '';

        if (this.currentUser.role === 'admin') {
            return 'p-badge-danger';
        } else if (this.currentUser.role === 'formateur') {
            return 'p-badge-info';
        } else if (this.currentUser.role === 'employe') {
            return 'p-badge-success';
        }

        return 'p-badge-secondary';
    }

    getPrimaryRole(): string {
        if (!this.currentUser) return '';

        if (this.currentUser.role === 'admin') {
            return 'Admin';
        } else if (this.currentUser.role === 'formateur') {
            return 'Formateur';
        } else if (this.currentUser.role === 'employe') {
            return 'Employé';
        }

        return 'User';
    }
}
