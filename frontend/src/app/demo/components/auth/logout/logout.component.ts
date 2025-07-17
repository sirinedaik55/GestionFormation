import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakAuthService } from '../../../../services/keycloak-auth.service';

@Component({
  selector: 'app-logout',
  template: `
    <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
      <div class="text-center">
        <i class="pi pi-spin pi-spinner text-4xl text-primary mb-3"></i>
        <div class="text-900 text-xl font-medium mb-3">Logging out...</div>
        <span class="text-600">Please wait while we sign you out</span>
      </div>
    </div>
  `
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: KeycloakAuthService
  ) {}

  ngOnInit(): void {
    this.performLogout();
  }

  private performLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Logout successful, redirect handled by service
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Even if logout fails, redirect to login
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
