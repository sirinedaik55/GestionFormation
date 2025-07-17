import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { KeycloakAuthService } from '../services/keycloak-auth.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {

    constructor(
        private authService: KeycloakAuthService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        return this.checkRole(route);
    }

    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        return this.checkRole(childRoute);
    }

    private checkRole(route: ActivatedRouteSnapshot): boolean {
        const expectedRoles = route.data['roles'] as string[];

        if (!expectedRoles || expectedRoles.length === 0) {
            return true;
        }

        const user = this.authService.getCurrentUserValue();

        if (!user) {
            this.router.navigate(['/auth/login']);
            return false;
        }

        const hasRole = this.authService.hasAnyRole(expectedRoles);

        if (!hasRole) {
            // Redirect based on user's actual role
            this.redirectToAuthorizedPage(user.roles);
            return false;
        }

        return true;
    }

    private redirectToAuthorizedPage(userRoles: string[]): void {
        if (userRoles.includes('admin')) {
            this.router.navigate(['/']);
        } else if (userRoles.includes('trainer')) {
            this.router.navigate(['/trainer/dashboard']);
        } else if (userRoles.includes('employee')) {
            this.router.navigate(['/employee/dashboard']);
        } else {
            this.router.navigate(['/unauthorized']);
        }
    }
}
