import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { KeycloakAuthService } from '../../../../services/keycloak-auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .p-password input {
            width: 100%;
            padding:1rem;
        }

        :host ::ng-deep .pi-eye{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }

        :host ::ng-deep .pi-eye-slash{
            transform:scale(1.6);
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
        private authService: KeycloakAuthService,
        public layoutService: LayoutService,
        public router: Router,
        private messageService: MessageService
    ) {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit(): void {
        // Pre-fill with demo credentials for testing
        this.loginForm.patchValue({
            username: 'admin@formation.com',
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

        this.authService.login(credentials).subscribe({
            next: (response) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Login successful!'
                });

                // Redirect after successful login
                setTimeout(() => {
                    this.authService.redirectAfterLogin();
                }, 1000);
            },
            error: (error) => {
                this.loading = false;
                const errorMessage = error.error?.message || 'Login failed. Please try again.';
                this.messageService.add({
                    severity: 'error',
                    summary: 'Login Failed',
                    detail: errorMessage
                });
            }
        });
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    fillDemoCredentials(role: 'admin' | 'trainer' | 'employee'): void {
        const credentials = {
            admin: { username: 'admin@formation.com', password: 'admin123' },
            trainer: { username: 'trainer@formation.com', password: 'trainer123' },
            employee: { username: 'employee@formation.com', password: 'employee123' }
        };

        this.loginForm.patchValue(credentials[role]);
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
