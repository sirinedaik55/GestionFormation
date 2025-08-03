import { Injectable } from '@angular/core';
import { KeycloakAuthService } from './keycloak-auth.service';

@Injectable({
    providedIn: 'root'
})
export class AppInitService {

    constructor(private authService: KeycloakAuthService) {}

    async initializeApp(): Promise<void> {
        // Simple initialization that never blocks
        console.log('Initializing app...');

        // Initialize auth service in background without blocking
        this.authService.initializeAuth().catch(error => {
            console.warn('Auth initialization failed, using fallback:', error);
        });

        console.log('App initialization complete');
    }
}
