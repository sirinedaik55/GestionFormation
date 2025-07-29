import { NgModule, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarModule } from 'primeng/avatar';
import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { SimpleAuthService } from '../../../../services/simple-auth.service';

@Component({
    selector: 'app-employee-profile',
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <div class="flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 class="text-900 font-semibold mb-2">My Profile</h2>
                            <p class="text-600 m-0">Manage your profile information and settings</p>
                        </div>
                        <p-button
                            *ngIf="!editMode"
                            icon="pi pi-pencil"
                            label="Edit Profile"
                            class="p-button-outlined"
                            (click)="toggleEditMode()">
                        </p-button>
                    </div>

                    <div class="grid" *ngIf="!loading">
                        <!-- Profile Picture & Basic Info -->
                        <div class="col-12 lg:col-4">
                            <div class="card">
                                <div class="text-center mb-4">
                                    <p-avatar
                                        [label]="getInitials()"
                                        size="xlarge"
                                        shape="circle"
                                        class="mb-3"
                                        [style]="{'background-color': '#6366f1', 'color': 'white', 'font-size': '2rem'}">
                                    </p-avatar>
                                    <div>
                                        <h4 class="text-900 font-semibold mb-1">{{ profile.first_name }} {{ profile.last_name }}</h4>
                                        <p class="text-600 m-0">{{ getRoleLabel(profile.role) }}</p>
                                    </div>
                                </div>

                                <div *ngIf="editMode" class="mb-4">
                                    <p-fileUpload
                                        mode="basic"
                                        chooseLabel="Change Photo"
                                        accept="image/*"
                                        [maxFileSize]="1000000"
                                        (onSelect)="onPhotoSelect($event)"
                                        class="w-full">
                                    </p-fileUpload>
                                </div>

                                <!-- Quick Stats -->
                                <div class="surface-100 border-round p-3">
                                    <div class="flex justify-content-between align-items-center mb-2">
                                        <span class="text-500">Team</span>
                                        <span class="text-900 font-medium">{{ profile.team || 'Not assigned' }}</span>
                                    </div>
                                    <div class="flex justify-content-between align-items-center mb-2">
                                        <span class="text-500">Formations</span>
                                        <span class="text-900 font-medium">{{ stats.totalFormations }}</span>
                                    </div>
                                    <div class="flex justify-content-between align-items-center">
                                        <span class="text-500">Certificates</span>
                                        <span class="text-900 font-medium">{{ stats.certificates }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Profile Details -->
                        <div class="col-12 lg:col-8">
                            <p-tabView>
                                <!-- Personal Information -->
                                <p-tabPanel header="Personal Information" leftIcon="pi pi-user">
                                    <div class="grid">
                                        <div class="col-12 md:col-6">
                                            <label class="block text-900 font-medium mb-2">First Name</label>
                                            <input
                                                *ngIf="editMode"
                                                type="text"
                                                pInputText
                                                [(ngModel)]="editProfile.first_name"
                                                class="w-full" />
                                            <p *ngIf="!editMode" class="text-900">{{ profile.first_name }}</p>
                                        </div>

                                        <div class="col-12 md:col-6">
                                            <label class="block text-900 font-medium mb-2">Last Name</label>
                                            <input
                                                *ngIf="editMode"
                                                type="text"
                                                pInputText
                                                [(ngModel)]="editProfile.last_name"
                                                class="w-full" />
                                            <p *ngIf="!editMode" class="text-900">{{ profile.last_name }}</p>
                                        </div>

                                        <div class="col-12 md:col-6">
                                            <label class="block text-900 font-medium mb-2">Email</label>
                                            <input
                                                *ngIf="editMode"
                                                type="email"
                                                pInputText
                                                [(ngModel)]="editProfile.email"
                                                class="w-full" />
                                            <p *ngIf="!editMode" class="text-900">{{ profile.email }}</p>
                                        </div>

                                        <div class="col-12 md:col-6">
                                            <label class="block text-900 font-medium mb-2">Phone</label>
                                            <input
                                                *ngIf="editMode"
                                                type="tel"
                                                pInputText
                                                [(ngModel)]="editProfile.phone"
                                                class="w-full" />
                                            <p *ngIf="!editMode" class="text-900">{{ profile.phone || 'Not provided' }}</p>
                                        </div>

                                        <div class="col-12">
                                            <label class="block text-900 font-medium mb-2">Bio</label>
                                            <textarea
                                                *ngIf="editMode"
                                                pInputTextarea
                                                [(ngModel)]="editProfile.bio"
                                                rows="4"
                                                class="w-full"
                                                placeholder="Tell us about yourself...">
                                            </textarea>
                                            <p *ngIf="!editMode" class="text-900">{{ profile.bio || 'No bio provided' }}</p>
                                        </div>
                                    </div>
                                </p-tabPanel>

                                <!-- Professional Information -->
                                <p-tabPanel header="Professional" leftIcon="pi pi-briefcase">
                                    <div class="grid">
                                        <div class="col-12 md:col-6">
                                            <label class="block text-900 font-medium mb-2">Role</label>
                                            <p class="text-900">{{ getRoleLabel(profile.role) }}</p>
                                        </div>

                                        <div class="col-12 md:col-6">
                                            <label class="block text-900 font-medium mb-2">Team</label>
                                            <p class="text-900">{{ profile.team || 'Not assigned' }}</p>
                                        </div>

                                        <div class="col-12 md:col-6">
                                            <label class="block text-900 font-medium mb-2">Department</label>
                                            <input
                                                *ngIf="editMode"
                                                type="text"
                                                pInputText
                                                [(ngModel)]="editProfile.department"
                                                class="w-full" />
                                            <p *ngIf="!editMode" class="text-900">{{ profile.department || 'Not specified' }}</p>
                                        </div>

                                        <div class="col-12 md:col-6">
                                            <label class="block text-900 font-medium mb-2">Join Date</label>
                                            <p class="text-900">{{ formatDate(profile.joinDate) }}</p>
                                        </div>

                                        <div class="col-12">
                                            <label class="block text-900 font-medium mb-2">Skills</label>
                                            <textarea
                                                *ngIf="editMode"
                                                pInputTextarea
                                                [(ngModel)]="editProfile.skills"
                                                rows="3"
                                                class="w-full"
                                                placeholder="List your skills...">
                                            </textarea>
                                            <p *ngIf="!editMode" class="text-900">{{ profile.skills || 'No skills listed' }}</p>
                                        </div>
                                    </div>
                                </p-tabPanel>

                                <!-- Preferences -->
                                <p-tabPanel header="Preferences" leftIcon="pi pi-cog">
                                    <div class="grid">
                                        <div class="col-12 md:col-6">
                                            <label class="block text-900 font-medium mb-2">Language</label>
                                            <p-dropdown
                                                *ngIf="editMode"
                                                [options]="languageOptions"
                                                [(ngModel)]="editProfile.language"
                                                placeholder="Select Language"
                                                class="w-full">
                                            </p-dropdown>
                                            <p *ngIf="!editMode" class="text-900">{{ getLanguageLabel(profile.language) }}</p>
                                        </div>

                                        <div class="col-12 md:col-6">
                                            <label class="block text-900 font-medium mb-2">Timezone</label>
                                            <p-dropdown
                                                *ngIf="editMode"
                                                [options]="timezoneOptions"
                                                [(ngModel)]="editProfile.timezone"
                                                placeholder="Select Timezone"
                                                class="w-full">
                                            </p-dropdown>
                                            <p *ngIf="!editMode" class="text-900">{{ profile.timezone || 'UTC' }}</p>
                                        </div>
                                    </div>
                                </p-tabPanel>
                            </p-tabView>

                            <!-- Action Buttons -->
                            <div *ngIf="editMode" class="flex justify-content-end gap-2 mt-4">
                                <p-button
                                    icon="pi pi-times"
                                    label="Cancel"
                                    class="p-button-outlined"
                                    (click)="cancelEdit()">
                                </p-button>
                                <p-button
                                    icon="pi pi-check"
                                    label="Save Changes"
                                    (click)="saveProfile()">
                                </p-button>
                            </div>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div *ngIf="loading" class="flex justify-content-center align-items-center py-5">
                        <p-progressSpinner strokeWidth="4"></p-progressSpinner>
                    </div>
                </div>
            </div>
        </div>
        <p-toast></p-toast>
    `
})
export class EmployeeProfileComponent implements OnInit {
    profile: any = {};
    editProfile: any = {};
    editMode: boolean = false;
    loading: boolean = true;

    stats = {
        totalFormations: 0,
        certificates: 0
    };

    languageOptions = [
        { label: 'English', value: 'en' },
        { label: 'Français', value: 'fr' },
        { label: 'العربية', value: 'ar' }
    ];

    timezoneOptions = [
        { label: 'UTC', value: 'UTC' },
        { label: 'Europe/Paris', value: 'Europe/Paris' },
        { label: 'Africa/Tunis', value: 'Africa/Tunis' }
    ];

    constructor(
        private authService: SimpleAuthService,
        private messageService: MessageService
    ) {}

    async ngOnInit() {
        await this.loadProfile();
    }

    async loadProfile() {
        try {
            this.loading = true;

            // Get current user from auth service
            const currentUser = this.authService.getCurrentUser();

            if (currentUser) {
                // Extend with additional profile data
                this.profile = {
                    ...currentUser,
                    bio: 'Passionate developer with expertise in modern web technologies.',
                    department: 'Information Technology',
                    joinDate: '2023-01-15T00:00:00',
                    skills: 'Angular, TypeScript, JavaScript, HTML, CSS, Node.js',
                    language: 'fr',
                    timezone: 'Europe/Paris'
                };

                this.editProfile = { ...this.profile };
                await this.loadStats();
            }

            this.loading = false;
        } catch (error) {
            console.error('Error loading profile:', error);
            this.loading = false;
        }
    }

    async loadStats() {
        // Mock stats
        this.stats = {
            totalFormations: 4,
            certificates: 3
        };
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        if (this.editMode) {
            this.editProfile = { ...this.profile };
        }
    }

    cancelEdit() {
        this.editMode = false;
        this.editProfile = { ...this.profile };
    }

    async saveProfile() {
        try {
            // Mock save operation
            await new Promise(resolve => setTimeout(resolve, 1000));

            this.profile = { ...this.editProfile };
            this.editMode = false;

            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile updated successfully!',
                life: 3000
            });
        } catch (error) {
            console.error('Error saving profile:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update profile. Please try again.',
                life: 3000
            });
        }
    }

    onPhotoSelect(event: any) {
        const file = event.files[0];
        if (file) {
            this.messageService.add({
                severity: 'info',
                summary: 'Photo Upload',
                detail: `Photo ${file.name} selected. This feature will be implemented soon.`,
                life: 3000
            });
        }
    }

    getInitials(): string {
        if (this.profile.first_name && this.profile.last_name) {
            return (this.profile.first_name.charAt(0) + this.profile.last_name.charAt(0)).toUpperCase();
        }
        return 'U';
    }

    getRoleLabel(role: string): string {
        switch (role) {
            case 'admin': return 'Administrator';
            case 'formateur': return 'Trainer';
            case 'employe': return 'Employee';
            default: return role;
        }
    }

    getLanguageLabel(language: string): string {
        const option = this.languageOptions.find(opt => opt.value === language);
        return option ? option.label : language;
    }

    formatDate(dateString: string): string {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
}

@NgModule({
    declarations: [EmployeeProfileComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        ToastModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        CalendarModule,
        FileUploadModule,
        AvatarModule,
        TabViewModule,
        ProgressSpinnerModule,
        RouterModule.forChild([
            { path: '', component: EmployeeProfileComponent }
        ])
    ],
    providers: [MessageService]
})
export class EmployeeProfileModule { }
