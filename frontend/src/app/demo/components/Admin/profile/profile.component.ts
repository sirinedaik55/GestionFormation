import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { StatisticsService } from '../../../../services/statistics.service';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    providers: [MessageService]
})
export class ProfileComponent implements OnInit {
    userProfile: any = null;
    originalProfile: any = null;
    editMode: boolean = false;
    loading: boolean = true;
    saving: boolean = false;
    
    stats = {
        totalFormations: 0,
        totalEmployees: 0,
        totalTrainers: 0,
        totalTeams: 0
    };

    constructor(
        private authService: AuthService,
        private statisticsService: StatisticsService,
        private messageService: MessageService
    ) {}

    async ngOnInit() {
        await this.loadProfile();
        await this.loadStats();
    }

    async loadProfile() {
        try {
            this.loading = true;
            console.log('Loading user profile...');
            
            // Get current user profile
            this.userProfile = await lastValueFrom(this.authService.getProfile());
            this.originalProfile = { ...this.userProfile };
            
            console.log('Profile loaded:', this.userProfile);
        } catch (error) {
            console.error('Error loading profile:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load profile information'
            });
        } finally {
            this.loading = false;
        }
    }

    async loadStats() {
        try {
            const dashboardStats = await lastValueFrom(this.statisticsService.getDashboardStats());
            this.stats = {
                totalFormations: dashboardStats.totalFormations || 0,
                totalEmployees: dashboardStats.totalEmployees || 0,
                totalTrainers: dashboardStats.totalTrainers || 0,
                totalTeams: dashboardStats.totalTeams || 0
            };
        } catch (error) {
            console.error('Error loading stats:', error);
            // Don't show error for stats, just keep zeros
        }
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        if (this.editMode) {
            this.originalProfile = { ...this.userProfile };
        }
    }

    async saveProfile() {
        try {
            this.saving = true;
            
            // Update profile via API
            const updatedProfile = await lastValueFrom(
                this.authService.updateProfile(this.userProfile)
            );
            
            this.userProfile = updatedProfile;
            this.originalProfile = { ...updatedProfile };
            this.editMode = false;
            
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile updated successfully'
            });
            
        } catch (error) {
            console.error('Error saving profile:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update profile'
            });
        } finally {
            this.saving = false;
        }
    }

    cancelEdit() {
        this.userProfile = { ...this.originalProfile };
        this.editMode = false;
        
        this.messageService.add({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Changes cancelled'
        });
    }
}
