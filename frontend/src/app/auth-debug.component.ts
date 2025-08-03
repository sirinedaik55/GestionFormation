import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakAuthService } from './services/keycloak-auth.service';

@Component({
  selector: 'app-auth-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; font-family: monospace;">
      <h2>🔍 Authentication Debug</h2>
      
      <div style="background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px;">
        <h3>Service Status</h3>
        <p><strong>Is Authenticated:</strong> {{ isAuthenticated }}</p>
        <p><strong>Current User:</strong> {{ currentUser | json }}</p>
        <p><strong>Has Access Token:</strong> {{ hasAccessToken }}</p>
      </div>

      <div style="background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px;">
        <h3>LocalStorage Contents</h3>
        <p><strong>keycloak_access_token:</strong> {{ accessToken ? 'EXISTS' : 'NULL' }}</p>
        <p><strong>keycloak_refresh_token:</strong> {{ refreshToken ? 'EXISTS' : 'NULL' }}</p>
        <p><strong>keycloak_user:</strong> {{ userString ? 'EXISTS' : 'NULL' }}</p>
        <p><strong>authToken:</strong> {{ authToken ? 'EXISTS' : 'NULL' }}</p>
        <p><strong>currentUser:</strong> {{ currentUserString ? 'EXISTS' : 'NULL' }}</p>
      </div>

      <div style="background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px;">
        <h3>Raw Data</h3>
        <p><strong>User Data:</strong></p>
        <pre>{{ userString }}</pre>
      </div>

      <div style="margin: 20px 0;">
        <button (click)="login()" style="margin: 5px; padding: 10px;">Test Login</button>
        <button (click)="logout()" style="margin: 5px; padding: 10px;">Test Logout</button>
        <button (click)="refresh()" style="margin: 5px; padding: 10px;">Refresh Data</button>
      </div>

      <div style="background: #e8f5e8; padding: 15px; margin: 10px 0; border-radius: 5px;">
        <h3>Quick Login</h3>
        <button (click)="quickLogin('admin')" style="margin: 5px; padding: 10px; background: #007bff; color: white;">Login as Admin</button>
        <button (click)="quickLogin('trainer')" style="margin: 5px; padding: 10px; background: #28a745; color: white;">Login as Trainer</button>
        <button (click)="quickLogin('employee')" style="margin: 5px; padding: 10px; background: #ffc107; color: black;">Login as Employee</button>
      </div>
    </div>
  `
})
export class AuthDebugComponent implements OnInit {
  isAuthenticated = false;
  currentUser: any = null;
  hasAccessToken = false;
  accessToken: string | null = null;
  refreshToken: string | null = null;
  userString: string | null = null;
  authToken: string | null = null;
  currentUserString: string | null = null;

  constructor(private authService: KeycloakAuthService) {}

  ngOnInit() {
    this.refresh();
    
    // Subscribe to auth changes
    this.authService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated = auth;
    });
    
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  refresh() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUserValue();
    this.hasAccessToken = this.authService.getAccessToken() !== null;
    
    this.accessToken = localStorage.getItem('keycloak_access_token');
    this.refreshToken = localStorage.getItem('keycloak_refresh_token');
    this.userString = localStorage.getItem('keycloak_user');
    this.authToken = localStorage.getItem('authToken');
    this.currentUserString = localStorage.getItem('currentUser');
  }

  login() {
    this.authService.login({ email: 'admin@formation.com', password: 'admin123' }).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        this.refresh();
      },
      error: (error) => {
        console.error('Login error:', error);
      }
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        this.refresh();
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }

  quickLogin(role: 'admin' | 'trainer' | 'employee') {
    const credentials = {
      admin: { email: 'admin@formation.com', password: 'admin123' },
      trainer: { email: 'trainer@formation.com', password: 'trainer123' },
      employee: { email: 'employee@formation.com', password: 'employee123' }
    };

    this.authService.login(credentials[role]).subscribe({
      next: (response) => {
        console.log(`${role} login response:`, response);
        this.refresh();
      },
      error: (error) => {
        console.error(`${role} login error:`, error);
      }
    });
  }
}
