import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { SimpleAuthService } from '../../../../services/simple-auth.service';

@Component({
    selector: 'app-trainer-profile',
    templateUrl: './trainer-profile.component.html',
    providers: [MessageService]
})
export class TrainerProfileComponent implements OnInit {
    
    // Profile data
    profile = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        speciality: '',
        bio: '',
        dateDebut: '',
        dateFin: ''
    };

    // Password change
    passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    // Settings
    settings = {
        emailNotifications: true,
        smsNotifications: false,
        reminderNotifications: true,
        weeklyReports: true,
        language: 'fr',
        theme: 'light',
        timezone: 'Europe/Paris'
    };

    // Options
    languageOptions = [
        { label: 'Français', value: 'fr' },
        { label: 'English', value: 'en' },
        { label: 'Español', value: 'es' }
    ];

    themeOptions = [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Auto', value: 'auto' }
    ];

    timezoneOptions = [
        { label: 'Europe/Paris', value: 'Europe/Paris' },
        { label: 'Europe/London', value: 'Europe/London' },
        { label: 'America/New_York', value: 'America/New_York' }
    ];

    loading = false;

    constructor(
        private messageService: MessageService,
        private authService: SimpleAuthService,
        private http: HttpClient
    ) {}

    ngOnInit() {
        this.loadProfile();
        this.loadSettings();
        console.log('🔧 TrainerProfileComponent initialized');
        console.log('🔧 Initial settings:', this.settings);
    }

    loadProfile() {
        // Get current user data - force trainer data
        this.profile = {
            firstName: 'Syrine',
            lastName: 'Daik',
            email: 'trainer@formation.com',
            phone: '+33123456789',
            speciality: 'Angular & TypeScript',
            bio: 'Formatrice expérimentée spécialisée dans les technologies de développement web modernes.',
            dateDebut: '2023-01-15',
            dateFin: ''
        };
    }

    loadSettings() {
        // Load settings from localStorage if available
        const savedSettings = localStorage.getItem('trainerSettings');
        if (savedSettings) {
            try {
                this.settings = JSON.parse(savedSettings);
                console.log('📂 Settings loaded from localStorage:', this.settings);

                // Apply saved theme
                this.applyTheme(this.settings.theme);
            } catch (error) {
                console.error('❌ Error loading settings from localStorage:', error);
            }
        } else {
            console.log('📂 No saved settings found, using defaults');
        }
    }

    saveProfile() {
        this.loading = true;
        
        // Simulate API call
        setTimeout(() => {
            this.loading = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile updated successfully',
                life: 3000
            });
        }, 1000);
    }

    changePassword() {
        console.log('🔐 Change Password clicked');
        console.log('🔐 Password data:', {
            currentPassword: this.passwordData.currentPassword ? '***' : 'empty',
            newPassword: this.passwordData.newPassword ? '***' : 'empty',
            confirmPassword: this.passwordData.confirmPassword ? '***' : 'empty'
        });

        // Validation
        if (!this.passwordData.currentPassword.trim()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Current password is required',
                life: 3000
            });
            return;
        }

        if (!this.passwordData.newPassword.trim()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'New password is required',
                life: 3000
            });
            return;
        }

        if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'New passwords do not match',
                life: 3000
            });
            return;
        }

        if (this.passwordData.newPassword.length < 8) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Password must be at least 8 characters long',
                life: 3000
            });
            return;
        }

        // Check password strength
        if (!this.isPasswordStrong(this.passwordData.newPassword)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Weak Password',
                detail: 'Password should contain uppercase, lowercase, numbers and special characters',
                life: 5000
            });
        }

        this.loading = true;

        // Simulate API call to backend
        this.performPasswordChange();
    }

    private performPasswordChange() {
        console.log('🔐 Sending password change request to backend...');

        const passwordChangeData = {
            current_password: this.passwordData.currentPassword,
            new_password: this.passwordData.newPassword,
            new_password_confirmation: this.passwordData.confirmPassword
        };

        // Real API call to Laravel backend
        this.http.post('http://localhost:8000/api/trainer/change-password', passwordChangeData)
            .subscribe({
                next: (response: any) => {
                    this.loading = false;

                    // Clear password fields on success
                    this.passwordData = {
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    };

                    // Save change to localStorage for tracking
                    const changeLog = {
                        timestamp: new Date().toISOString(),
                        action: 'password_changed',
                        user: this.profile.email
                    };
                    localStorage.setItem('lastPasswordChange', JSON.stringify(changeLog));

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Password Changed',
                        detail: response.message || 'Your password has been successfully updated',
                        life: 5000
                    });

                    console.log('✅ Password changed successfully:', response);
                },
                error: (error) => {
                    this.loading = false;

                    let errorMessage = 'An error occurred while changing password';

                    if (error.status === 400) {
                        errorMessage = 'Current password is incorrect';
                    } else if (error.status === 422) {
                        errorMessage = error.error.message || 'Validation failed';
                    } else if (error.status === 401) {
                        errorMessage = 'Authentication failed';
                    }

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Password Change Failed',
                        detail: errorMessage,
                        life: 5000
                    });

                    console.error('❌ Password change failed:', error);
                }
            });
    }

    private isPasswordStrong(password: string): boolean {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    }

    saveSettings() {
        console.log('💾 Save Settings clicked');
        console.log('💾 Current settings:', this.settings);

        this.loading = true;

        // Validate settings
        if (!this.settings.language || !this.settings.theme || !this.settings.timezone) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill all required fields',
                life: 3000
            });
            this.loading = false;
            return;
        }

        // Apply theme change immediately
        this.applyTheme(this.settings.theme);

        // Save to localStorage for persistence
        localStorage.setItem('trainerSettings', JSON.stringify(this.settings));

        // Simulate API call
        setTimeout(() => {
            this.loading = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Settings Saved',
                detail: `Settings saved successfully. Theme: ${this.settings.theme}, Language: ${this.settings.language}`,
                life: 5000
            });

            console.log('✅ Settings saved to localStorage:', this.settings);
        }, 1000);
    }

    resetSettings() {
        console.log('🔄 Reset Settings clicked');

        // Reset to default values
        this.settings = {
            emailNotifications: true,
            smsNotifications: false,
            reminderNotifications: true,
            weeklyReports: true,
            language: 'fr',
            theme: 'light',
            timezone: 'Europe/Paris'
        };

        // Apply default theme
        this.applyTheme('light');

        // Clear localStorage
        localStorage.removeItem('trainerSettings');

        console.log('🔄 Settings reset to:', this.settings);

        this.messageService.add({
            severity: 'info',
            summary: 'Settings Reset',
            detail: 'All settings have been reset to default values',
            life: 3000
        });
    }

    // Apply theme changes
    applyTheme(theme: string) {
        const body = document.body;

        // Remove existing theme classes
        body.classList.remove('light-theme', 'dark-theme', 'auto-theme');

        // Apply new theme
        switch (theme) {
            case 'dark':
                body.classList.add('dark-theme');
                body.style.backgroundColor = '#1e1e1e';
                body.style.color = '#ffffff';
                console.log('🌙 Dark theme applied');
                break;
            case 'light':
                body.classList.add('light-theme');
                body.style.backgroundColor = '#ffffff';
                body.style.color = '#000000';
                console.log('☀️ Light theme applied');
                break;
            case 'auto':
                body.classList.add('auto-theme');
                // Use system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    body.style.backgroundColor = '#1e1e1e';
                    body.style.color = '#ffffff';
                } else {
                    body.style.backgroundColor = '#ffffff';
                    body.style.color = '#000000';
                }
                console.log('🔄 Auto theme applied');
                break;
        }
    }

    // Methods to detect changes
    onLanguageChange(event: any) {
        console.log('🌐 Language changed to:', event.value);
        this.messageService.add({
            severity: 'info',
            summary: 'Language Changed',
            detail: `Language changed to ${event.value}`,
            life: 2000
        });
    }

    onThemeChange(event: any) {
        console.log('🎨 Theme changed to:', event.value);
        this.applyTheme(event.value);
        this.messageService.add({
            severity: 'info',
            summary: 'Theme Changed',
            detail: `Theme changed to ${event.value}`,
            life: 2000
        });
    }

    onTimezoneChange(event: any) {
        console.log('🕐 Timezone changed to:', event.value);
        this.messageService.add({
            severity: 'info',
            summary: 'Timezone Changed',
            detail: `Timezone changed to ${event.value}`,
            life: 2000
        });
    }

    onNotificationToggle(type: string, value: boolean) {
        console.log(`🔔 ${type} notification toggled to:`, value);
        this.messageService.add({
            severity: 'info',
            summary: 'Notification Setting',
            detail: `${type} notifications ${value ? 'enabled' : 'disabled'}`,
            life: 2000
        });
    }
}
