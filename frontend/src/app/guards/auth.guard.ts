import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(
        private tokenService: TokenService,
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
        const hasToken = this.tokenService.hasToken();

        if (hasToken) {
            return true;
        } else {
            // Store the attempted URL for redirecting after login
            localStorage.setItem('attempted_url', url);
            this.router.navigate(['/auth/login']);
            return false;
        }
    }
}
