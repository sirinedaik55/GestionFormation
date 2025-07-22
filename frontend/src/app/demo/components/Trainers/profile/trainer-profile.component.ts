import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { KeycloakAuthService } from '../../../../services/keycloak-auth.service';

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
        private keycloakAuthService: KeycloakAuthService
    ) {}

    ngOnInit() {
        this.loadProfile();
    }

    loadProfile() {
        // Get current user data
        const user = this.keycloakAuthService.getCurrentUserValue();
        if (user) {
            this.profile = {
                firstName: user.first_name || 'Syrine',
                lastName: user.last_name || 'Daik',
                email: user.email || 'trainer@formation.com',
                phone: '+33123456789',
                speciality: user.specialite || 'Angular & TypeScript',
                bio: 'Experienced trainer specializing in modern web development technologies.',
                dateDebut: '2023-01-15',
                dateFin: ''
            };
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
        if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'New passwords do not match',
                life: 3000
            });
            return;
        }

        if (this.passwordData.newPassword.length < 6) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Password must be at least 6 characters long',
                life: 3000
            });
            return;
        }

        this.loading = true;
        
        // Simulate API call
        setTimeout(() => {
            this.loading = false;
            this.passwordData = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
            
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Password changed successfully',
                life: 3000
            });
        }, 1000);
    }

    saveSettings() {
        this.loading = true;
        
        // Simulate API call
        setTimeout(() => {
            this.loading = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Settings saved successfully',
                life: 3000
            });
        }, 1000);
    }

    resetSettings() {
        this.settings = {
            emailNotifications: true,
            smsNotifications: false,
            reminderNotifications: true,
            weeklyReports: true,
            language: 'fr',
            theme: 'light',
            timezone: 'Europe/Paris'
        };
        
        this.messageService.add({
            severity: 'info',
            summary: 'Reset',
            detail: 'Settings reset to default values',
            life: 3000
        });
    }
}
