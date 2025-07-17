import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private accessTokenKey = 'keycloak_access_token';
    private refreshTokenKey = 'keycloak_refresh_token';

    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Add auth header if user is authenticated
        const authReq = this.addAuthHeader(req);

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                // Handle 401 errors (token expired)
                if (error.status === 401 && !this.isAuthUrl(req.url)) {
                    return this.handle401Error(authReq, next);
                }
                
                return throwError(error);
            })
        );
    }

    private addAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
        const token = this.getAccessToken();

        if (token && !this.isAuthUrl(req.url)) {
            return req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return req;
    }

    private getAccessToken(): string | null {
        return localStorage.getItem(this.accessTokenKey);
    }

    private getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey);
    }

    private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
                this.clearTokensAndRedirect();
                return throwError('No refresh token available');
            }

            return this.performTokenRefresh(refreshToken).pipe(
                switchMap((response: any) => {
                    this.isRefreshing = false;

                    if (response.success) {
                        this.setTokens(response.data.access_token, response.data.refresh_token);
                        this.refreshTokenSubject.next(response.data.access_token);

                        // Retry the original request with new token
                        return next.handle(this.addAuthHeader(req));
                    } else {
                        this.clearTokensAndRedirect();
                        return throwError('Token refresh failed');
                    }
                }),
                catchError((error) => {
                    this.isRefreshing = false;
                    this.clearTokensAndRedirect();
                    return throwError(error);
                })
            );
        } else {
            // Wait for refresh to complete
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(() => next.handle(this.addAuthHeader(req)))
            );
        }
    }

    private performTokenRefresh(refreshToken: string): Observable<any> {
        return new Observable(observer => {
            fetch('http://localhost:8000/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token: refreshToken })
            })
            .then(response => response.json())
            .then(data => {
                observer.next(data);
                observer.complete();
            })
            .catch(error => {
                observer.error(error);
            });
        });
    }

    private setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    private clearTokensAndRedirect(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem('keycloak_user');
        this.router.navigate(['/auth/login']);
    }

    private isAuthUrl(url: string): boolean {
        return url.includes('/auth/login') || 
               url.includes('/auth/refresh') || 
               url.includes('/auth/config');
    }
}
