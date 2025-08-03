import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { SimpleAuthService } from '../../../../services/simple-auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`


        /* Simple Form Styles */
        :host ::ng-deep .p-password input {
            width: 100%;
            padding: 1rem;
        }

        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform: scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    providers: [MessageService]
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    showPassword = false;

    constructor(
        private fb: FormBuilder,
        private authService: SimpleAuthService,
        public layoutService: LayoutService,
        public router: Router,
        private messageService: MessageService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit(): void {
        // Pre-fill with demo credentials for testing
        this.loginForm.patchValue({
            email: 'admin@formation.com',
            password: 'admin123'
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.markFormGroupTouched();
            return;
        }

        this.loading = true;
        const credentials = this.loginForm.value;

        console.log('Login attempt with:', credentials);

        this.authService.login(credentials).subscribe({
            next: (response: any) => {
                console.log('Login response:', response);
                this.loading = false;

                if (response.success) {
                    console.log('Login successful, redirecting...');
                    const user = response.user;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Login Successful',
                        detail: `Welcome ${user.first_name} ${user.last_name}!`
                    });

                    // Redirect based on user role
                    this.redirectBasedOnRole(user.role);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Login Failed',
                        detail: response.message || 'Invalid credentials'
                    });
                }
            },
            error: (error: any) => {
                console.error('Login error:', error);
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Login Failed',
                    detail: 'An error occurred. Please try again.'
                });
            }
        });
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    fillDemoCredentials(role: 'admin' | 'trainer' | 'employee'): void {
        const credentials = {
            admin: { email: 'admin@formation.com', password: 'admin123' },
            trainer: { email: 'trainer@formation.com', password: 'trainer123' },
            employee: { email: 'employee@formation.com', password: 'employee123' }
        };

        this.loginForm.patchValue(credentials[role]);
    }

    private redirectBasedOnRole(role: string): void {
        console.log('🔄 Redirecting user with role:', role);

        let targetRoute: string;

        switch (role) {
            case 'admin':
                targetRoute = '/dashboard';
                break;
            case 'formateur':
            case 'trainer':
                targetRoute = '/dashboard/trainer';
                break;
            case 'employe':
            case 'employee':
                targetRoute = '/dashboard/employee';
                break;
            default:
                console.warn('Unknown role:', role, 'redirecting to dashboard');
                targetRoute = '/dashboard';
        }

        console.log('🎯 Navigating to:', targetRoute);

        this.router.navigate([targetRoute]).then(
            (success) => {
                console.log('✅ Navigation success:', success);
                console.log('🏠 Current URL:', this.router.url);
            },
            (error) => {
                console.error('❌ Navigation error:', error);
                // Fallback to dashboard if specific route fails
                this.router.navigate(['/dashboard']);
            }
        );
    }



    private markFormGroupTouched(): void {
        Object.keys(this.loginForm.controls).forEach(key => {
            const control = this.loginForm.get(key);
            control?.markAsTouched();
        });
    }

    // Helper methods for template
    isFieldInvalid(fieldName: string): boolean {
        const field = this.loginForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getFieldError(fieldName: string): string {
        const field = this.loginForm.get(fieldName);
        if (field?.errors) {
            if (field.errors['required']) {
                return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
            }
            if (field.errors['minlength']) {
                return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
            }
        }
        return '';
    }
}
