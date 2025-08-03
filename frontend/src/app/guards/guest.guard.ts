import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SimpleAuthService } from '../services/simple-auth.service';

@Injectable({
    providedIn: 'root'
})
export class GuestGuard implements CanActivate {

    constructor(
        private authService: SimpleAuthService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const isAuthenticated = this.authService.isAuthenticated();

        if (isAuthenticated) {
            // User is already authenticated, redirect to dashboard
            this.router.navigate(['/dashboard']);
            return false;
        } else {
            // User is not authenticated, allow access to login page
            return true;
        }
    }
}
