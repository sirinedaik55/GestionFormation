import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MockAuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('🔧 MockAuthInterceptor: Intercepting request to:', req.url);

        // Skip auth URLs
        if (req.url.includes('/auth/')) {
            console.log('🔧 MockAuthInterceptor: Skipping auth URL');
            return next.handle(req);
        }

        // Add mock authorization header for API requests
        if (req.url.includes('/api/')) {
            console.log('🔧 MockAuthInterceptor: Adding mock auth header to:', req.url);

            // Create mock token in the format expected by KeycloakMiddleware
            const mockTokenData = {
                user: {
                    id: '1',
                    username: 'admin@formation.com',
                    email: 'admin@formation.com',
                    name: 'Administrator',
                    first_name: 'Admin',
                    last_name: 'User',
                    roles: ['admin'],
                    team: 'Administration'
                },
                exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
                iat: Math.floor(Date.now() / 1000)
            };

            const mockToken = btoa(JSON.stringify(mockTokenData));
            console.log('🔧 MockAuthInterceptor: Using mock token:', mockToken.substring(0, 50) + '...');

            const authReq = req.clone({
                setHeaders: {
                    'Authorization': `Bearer ${mockToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('🔧 MockAuthInterceptor: Request headers:', authReq.headers.keys());
            return next.handle(authReq);
        }

        console.log('🔧 MockAuthInterceptor: No modification needed for:', req.url);
        return next.handle(req);
    }
}
