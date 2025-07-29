import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
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
        private authService: SimpleAuthService
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
