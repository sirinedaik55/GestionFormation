import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { KeycloakAuthService } from '../services/keycloak-auth.service';

@Injectable({
    providedIn: 'root'
})
export class KeycloakAuthGuard implements CanActivate, CanActivateChild {

    constructor(
        private authService: KeycloakAuthService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        
        return this.checkAuth(route, state);
    }

    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        
        return this.checkAuth(childRoute, state);
    }

    private checkAuth(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        console.log('🚧 KeycloakAuthGuard: TEMPORARILY DISABLED - Allowing all access');
        console.log('🚧 Route:', state.url);

        // TEMPORARY: Always return true to bypass authentication completely
        return true;

        /* ORIGINAL CODE - COMMENTED OUT FOR DEBUGGING
        console.log('🔒 KeycloakAuthGuard: Checking auth for route:', state.url);
        console.log('🔒 KeycloakAuthGuard: Route data:', route.data);

        // Check multiple token sources
        const keycloakToken = this.authService.getAccessToken();
        const authToken = localStorage.getItem('authToken');
        const auth_token = localStorage.getItem('auth_token');

        console.log('🔒 KeycloakAuthGuard: Keycloak token:', keycloakToken ? 'EXISTS' : 'NULL');
        console.log('🔒 KeycloakAuthGuard: Auth token:', authToken ? 'EXISTS' : 'NULL');
        console.log('🔒 KeycloakAuthGuard: Auth_token:', auth_token ? 'EXISTS' : 'NULL');

        const hasToken = keycloakToken !== null || authToken !== null || auth_token !== null;
        console.log('🔒 KeycloakAuthGuard: Has any token:', hasToken);

        if (hasToken) {
            // Check if user has required role
            const requiredRoles = route.data['roles'] as string[];
            console.log('🔒 KeycloakAuthGuard: Required roles:', requiredRoles);

            if (requiredRoles && requiredRoles.length > 0) {
                const currentUser = this.authService.getCurrentUserValue();
                const currentUserStr = localStorage.getItem('keycloak_user') || localStorage.getItem('currentUser');

                console.log('🔒 KeycloakAuthGuard: Current user from service:', currentUser);
                console.log('🔒 KeycloakAuthGuard: Current user from localStorage:', currentUserStr);

                // Try to get user from localStorage if service doesn't have it
                let user = currentUser;
                if (!user && currentUserStr) {
                    try {
                        user = JSON.parse(currentUserStr);
                        console.log('🔒 KeycloakAuthGuard: Parsed user from localStorage:', user);
                    } catch (e) {
                        console.error('🔒 KeycloakAuthGuard: Error parsing user from localStorage:', e);
                    }
                }

                if (user && user.roles && this.hasAnyRole(user.roles, requiredRoles)) {
                    console.log('✅ KeycloakAuthGuard: Access granted - user has required roles');
                    return true;
                } else {
                    console.log('❌ KeycloakAuthGuard: Access denied - insufficient roles');
                    console.log('User roles:', user?.roles);
                    console.log('Required roles:', requiredRoles);

                    this.router.navigate(['/unauthorized']);
                    return false;
                }
            }

            console.log('✅ KeycloakAuthGuard: Access granted - no role requirements');
            return true;
        } else {
            console.log('❌ KeycloakAuthGuard: No token - redirecting to login');
            // User is not authenticated, redirect to login
            this.router.navigate(['/auth/login'], {
                queryParams: { returnUrl: state.url }
            });
            return false;
        }
        */
    }

    private hasAnyRole(userRoles: string[], requiredRoles: string[]): boolean {
        return requiredRoles.some(role => userRoles.includes(role));
    }
}
