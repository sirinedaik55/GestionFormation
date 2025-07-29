import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SimpleAuthService } from '../services/simple-auth.service';

@Injectable({
    providedIn: 'root'
})
export class SimpleAuthGuard implements CanActivate {

    constructor(
        private authService: SimpleAuthService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        
        if (this.authService.isAuthenticated()) {
            // Check if user has required role
            const requiredRoles = route.data['roles'] as string[];
            
            if (requiredRoles && requiredRoles.length > 0) {
                if (this.authService.hasAnyRole(requiredRoles)) {
                    return true;
                } else {
                    // User doesn't have required role, redirect to unauthorized
                    this.router.navigate(['/auth/unauthorized']);
                    return false;
                }
            }
            
            return true;
        } else {
            // User is not authenticated, redirect to login
            this.router.navigate(['/auth/login'], { 
                queryParams: { returnUrl: state.url } 
            });
            return false;
        }
    }
}
