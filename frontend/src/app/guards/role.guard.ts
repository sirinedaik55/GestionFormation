import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SimpleAuthService } from '../services/simple-auth.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {

    constructor(
        private authService: SimpleAuthService,
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

        const user = this.authService.getCurrentUser();

        if (!user) {
            this.router.navigate(['/auth/login']);
            return false;
        }

        const hasRole = this.hasAnyRole(user.role, expectedRoles);

        if (!hasRole) {
            // Redirect based on user's actual role
            this.redirectToAuthorizedPage([user.role]);
            return false;
        }

        return true;
    }

    private hasAnyRole(userRole: string, requiredRoles: string[]): boolean {
        return requiredRoles.includes(userRole) ||
               (userRole === 'formateur' && requiredRoles.includes('trainer')) ||
               (userRole === 'trainer' && requiredRoles.includes('formateur')) ||
               (userRole === 'employe' && requiredRoles.includes('employee')) ||
               (userRole === 'employee' && requiredRoles.includes('employe'));
    }

    private redirectToAuthorizedPage(userRoles: string[]): void {
        if (userRoles.includes('admin')) {
            this.router.navigate(['/']);
        } else if (userRoles.includes('trainer') || userRoles.includes('formateur')) {
            this.router.navigate(['/trainer']);
        } else if (userRoles.includes('employee') || userRoles.includes('employe')) {
            this.router.navigate(['/employee']);
        } else {
            this.router.navigate(['/unauthorized']);
        }
    }
}
