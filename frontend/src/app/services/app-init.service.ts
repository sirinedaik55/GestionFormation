import { Injectable } from '@angular/core';
import { KeycloakAuthService } from './keycloak-auth.service';

@Injectable({
    providedIn: 'root'
})
export class AppInitService {

    constructor(private authService: KeycloakAuthService) {}

    async initializeApp(): Promise<void> {
        try {
            // Initialize authentication service
            await this.authService.initializeAuth();
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }
}
