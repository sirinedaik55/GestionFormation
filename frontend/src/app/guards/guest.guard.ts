import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { KeycloakAuthService } from '../services/keycloak-auth.service';
import { TokenService } from '../services/token.service';

@Injectable({
    providedIn: 'root'
})
export class GuestGuard implements CanActivate {

    constructor(
        private authService: KeycloakAuthService,
        private tokenService: TokenService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const hasToken = this.tokenService.hasToken();

        if (hasToken) {
            // User is already authenticated, redirect to appropriate dashboard
            this.authService.redirectAfterLogin();
            return false;
        } else {
            // User is not authenticated, allow access to login page
            return true;
        }
    }
}
