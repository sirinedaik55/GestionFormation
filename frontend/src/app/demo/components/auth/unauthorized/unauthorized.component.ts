import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakAuthService } from '../../../../services/keycloak-auth.service';

@Component({
    selector: 'app-unauthorized',
    template: `
        <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
                <div class="col-12 text-center">
                    <div class="text-center">
                        <i class="pi pi-lock text-6xl text-red-500 mb-4"></i>
                        <div class="text-900 text-4xl font-bold mb-3">Access Denied</div>
                        <div class="text-600 text-xl mb-5">
                            You don't have permission to access this resource.
                        </div>
                        
                        <div class="mb-5" *ngIf="currentUser">
                            <div class="text-700 mb-2">Current User:</div>
                            <div class="text-900 font-medium">{{currentUser.name}} ({{currentUser.username}})</div>
                            <div class="text-600">Role: {{currentUser.roles.join(', ')}}</div>
                        </div>

                        <div class="flex gap-3 justify-content-center flex-wrap">
                            <p-button 
                                label="Go to Dashboard" 
                                icon="pi pi-home"
                                class="p-button-primary"
                                (click)="goToDashboard()">
                            </p-button>
                            
                            <p-button 
                                label="Logout" 
                                icon="pi pi-sign-out"
                                class="p-button-outlined p-button-secondary"
                                (click)="logout()">
                            </p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class UnauthorizedComponent {
    
    currentUser = this.authService.getCurrentUserValue();

    constructor(
        private router: Router,
        private authService: KeycloakAuthService
    ) {}

    goToDashboard(): void {
        this.authService.redirectAfterLogin();
    }

    logout(): void {
        this.authService.logout().subscribe();
    }
}
