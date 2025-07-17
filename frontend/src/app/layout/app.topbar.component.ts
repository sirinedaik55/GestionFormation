import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from "./service/app.layout.service";
import { KeycloakAuthService, KeycloakUser } from '../services/keycloak-auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit, OnDestroy {

    items!: MenuItem[];
    currentUser: KeycloakUser | null = null;
    private userSubscription?: Subscription;

    constructor(
        public layoutService: LayoutService,
        private authService: KeycloakAuthService
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
                    label: this.currentUser.name || this.currentUser.username,
                    icon: 'pi pi-user',
                    items: [
                        {
                            label: 'Profile',
                            icon: 'pi pi-user-edit',
                            command: () => this.goToProfile()
                        },
                        {
                            label: 'Settings',
                            icon: 'pi pi-cog',
                            command: () => this.goToSettings()
                        },
                        {
                            separator: true
                        },
                        {
                            label: 'Logout',
                            icon: 'pi pi-sign-out',
                            command: () => this.logout()
                        }
                    ]
                }
            ];
        }
    }

    private goToProfile(): void {
        // TODO: Navigate to profile page
        console.log('Navigate to profile');
    }

    private goToSettings(): void {
        // TODO: Navigate to settings page
        console.log('Navigate to settings');
    }

    logout(): void {
        this.authService.logout().subscribe();
    }

    getRoleBadgeClass(): string {
        if (!this.currentUser) return '';

        if (this.currentUser.roles.includes('admin')) {
            return 'p-badge-danger';
        } else if (this.currentUser.roles.includes('trainer')) {
            return 'p-badge-info';
        } else if (this.currentUser.roles.includes('employee')) {
            return 'p-badge-success';
        }

        return 'p-badge-secondary';
    }

    getPrimaryRole(): string {
        if (!this.currentUser) return '';

        if (this.currentUser.roles.includes('admin')) {
            return 'Admin';
        } else if (this.currentUser.roles.includes('trainer')) {
            return 'Trainer';
        } else if (this.currentUser.roles.includes('employee')) {
            return 'Employee';
        }

        return 'User';
    }
}
