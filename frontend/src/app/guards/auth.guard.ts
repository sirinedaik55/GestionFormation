import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SimpleAuthService } from '../services/simple-auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(
        private authService: SimpleAuthService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        return this.checkAuth(state.url);
    }

    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        return this.checkAuth(state.url);
    }

    private checkAuth(url: string): boolean {
        const isAuthenticated = this.authService.isAuthenticated();

        if (isAuthenticated) {
            return true;
        } else {
            // Store the attempted URL for redirecting after login
            localStorage.setItem('attempted_url', url);
            this.router.navigate(['/auth/login']);
            return false;
        }
    }
}
