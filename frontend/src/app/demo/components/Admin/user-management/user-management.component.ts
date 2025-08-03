import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiService } from '../../../../services/api.service';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    team?: any;
    phone?: string;
    specialite?: string;
    status: string;
    created_at: string;
    last_login_at?: string;
}

interface Team {
    id: number;
    name: string;
    speciality: string;
}

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    providers: [MessageService, ConfirmationService]
})
export class UserManagementComponent implements OnInit {

    users: User[] = [];
    teams: Team[] = [];
    loading = false;
    
    // Dialog states
    userDialog = false;
    deleteUserDialog = false;
    
    // Form data
    user: User = this.getEmptyUser();
    selectedUsers: User[] = [];
    
    // Filters
    roleFilter = '';
    statusFilter = '';
    searchTerm = '';
    
    // Options
    roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Trainer', value: 'formateur' },
        { label: 'Employee', value: 'employe' }
    ];
    
    statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
    ];

    constructor(
        private http: HttpClient,
        private apiService: ApiService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadUsers();
        this.loadTeams();
    }

    loadUsers() {
        this.loading = true;
        
        let params: any = {};
        if (this.roleFilter) params.role = this.roleFilter;
        if (this.statusFilter) params.status = this.statusFilter;
        if (this.searchTerm) params.search = this.searchTerm;

        this.http.get(`${this.apiService.getApiUrl()}/test/admin/users`, { params })
            .subscribe({
                next: (response: any) => {
                    this.users = response.data?.data || response.data || response;
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading users:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load users'
                    });
                    this.loading = false;
                }
            });
    }

    loadTeams() {
        this.http.get(`${this.apiService.getApiUrl()}/test/teams`)
            .subscribe({
                next: (response: any) => {
                    this.teams = response.data || response;
                },
                error: (error) => {
                    console.error('Error loading teams:', error);
                }
            });
    }

    openNew() {
        this.user = this.getEmptyUser();
        this.userDialog = true;
    }

    editUser(user: User) {
        this.user = { ...user };
        this.userDialog = true;
    }

    deleteUser(user: User) {
        this.user = user;
        this.deleteUserDialog = true;
    }

    confirmDelete() {
        this.http.delete(`${this.apiService.getApiUrl()}/test/admin/users/${this.user.id}`)
            .subscribe({
                next: () => {
                    this.users = this.users.filter(u => u.id !== this.user.id);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User deleted successfully'
                    });
                    this.deleteUserDialog = false;
                    this.user = this.getEmptyUser();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error?.message || 'Failed to delete user'
                    });
                }
            });
    }

    saveUser() {
        if (this.user.first_name?.trim() && this.user.last_name?.trim() && this.user.email?.trim()) {
            if (this.user.id) {
                // Update existing user
                this.http.put(`${this.apiService.getApiUrl()}/test/admin/users/${this.user.id}`, this.user)
                    .subscribe({
                        next: (response: any) => {
                            const index = this.users.findIndex(u => u.id === this.user.id);
                            if (index !== -1) {
                                this.users[index] = response.data;
                            }
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'User updated successfully'
                            });
                            this.userDialog = false;
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: error.error?.message || 'Failed to update user'
                            });
                        }
                    });
            } else {
                // Create new user
                this.http.post(`${this.apiService.getApiUrl()}/test/admin/users`, this.user)
                    .subscribe({
                        next: (response: any) => {
                            this.users.push(response.data);
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: `User created successfully. Temporary password: ${response.temporary_password}`
                            });
                            this.userDialog = false;
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: error.error?.message || 'Failed to create user'
                            });
                        }
                    });
            }
        }
    }

    resetPassword(user: User) {
        this.confirmationService.confirm({
            message: `Reset password for ${user.first_name} ${user.last_name}?`,
            header: 'Confirm Password Reset',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.http.post(`${this.apiService.getApiUrl()}/test/admin/users/${user.id}/reset-password`, {})
                    .subscribe({
                        next: (response: any) => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Password Reset',
                                detail: `New password: ${response.temporary_password}`
                            });
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to reset password'
                            });
                        }
                    });
            }
        });
    }

    onFilter() {
        this.loadUsers();
    }

    clearFilters() {
        this.roleFilter = '';
        this.statusFilter = '';
        this.searchTerm = '';
        this.loadUsers();
    }

    hideDialog() {
        this.userDialog = false;
    }

    private getEmptyUser(): User {
        return {
            id: 0,
            first_name: '',
            last_name: '',
            email: '',
            role: 'employe',
            phone: '',
            specialite: '',
            status: 'active',
            created_at: ''
        };
    }

    getRoleBadgeClass(role: string): string {
        switch (role) {
            case 'admin': return 'p-badge-danger';
            case 'formateur': return 'p-badge-info';
            case 'employe': return 'p-badge-success';
            default: return 'p-badge-secondary';
        }
    }

    getStatusBadgeClass(status: string): string {
        return status === 'active' ? 'p-badge-success' : 'p-badge-warning';
    }
}
