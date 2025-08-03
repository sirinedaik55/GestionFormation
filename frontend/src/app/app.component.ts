import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    menuMode = 'static';

    constructor(private primengConfig: PrimeNGConfig) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';

        // TEMPORARY: Set mock user in localStorage for testing
        const mockUser = {
            id: '1',
            username: 'admin@formation.com',
            email: 'admin@formation.com',
            name: 'Administrator',
            first_name: 'Admin',
            last_name: 'User',
            roles: ['admin'],
            team: 'Administration'
        };

        const mockToken = btoa(JSON.stringify({
            user: mockUser,
            exp: Math.floor(Date.now() / 1000) + 3600,
            iat: Math.floor(Date.now() / 1000)
        }));

        localStorage.setItem('keycloak_user', JSON.stringify(mockUser));
        localStorage.setItem('keycloak_access_token', mockToken);
        localStorage.setItem('keycloak_refresh_token', 'mock-refresh-token');

        console.log('🚧 TEMPORARY: Mock user set in localStorage');
    }
}
