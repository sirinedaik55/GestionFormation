import { Component, OnInit } from '@angular/core';
import { User, getFullName, CreateUserRequest, UpdateUserRequest } from '../../../../../models/user.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { UserService } from '../../../../service/user.service';
import { lastValueFrom } from 'rxjs';

@Component({
    templateUrl: './trainers.component.html',
    providers: [MessageService]
})
export class TrainersComponent implements OnInit {
    userDialog: boolean = false;
    deleteUserDialog: boolean = false;
    deleteUsersDialog: boolean = false;
    users: User[] = [];
    user: User = {} as User;
    selectedUsers: User[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    constructor(private userService: UserService, private messageService: MessageService) { }

    async ngOnInit() {
        try {
            // Load trainers
            const users = await this.userService.getUsersByRole('formateur');
            this.users = users.map(user => ({
                ...user,
                name: getFullName(user)
            }));
        } catch (error) {
            console.error('Error loading trainers:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load trainers',
                life: 3000
            });
        }

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Name' },
            { field: 'email', header: 'Email' },
            { field: 'phone', header: 'Phone' },
            { field: 'specialite', header: 'Speciality' }
        ];
    }
    openNew() {
        this.user = {
            role: 'formateur',
            first_name: '',
            last_name: '',
            email: '',
            specialite: ''
        } as User;
        this.submitted = false;
        this.userDialog = true;
    }
    // Table global filter
    onGlobalFilter(table: Table, event: Event) {
        const input = event.target as HTMLInputElement;
        table.filterGlobal(input.value, 'contains');
    }

    // CRUD methods
    editUser(user: User) {
        this.user = { ...user };
        this.userDialog = true;
    }

    deleteUser(user: User) {
        this.user = user;
        this.deleteUserDialog = true;
    }

    deleteSelectedUsers() {
        this.deleteUsersDialog = true;
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    async saveUser() {
        this.submitted = true;

        if (this.user.first_name?.trim() && this.user.last_name?.trim() && this.user.email?.trim()) {
            try {
                console.log('Saving user data:', this.user); // Debug log

                if (this.user.id) {
                    // Update existing trainer
                    console.log('Updating trainer with ID:', this.user.id);
                    const updateData: UpdateUserRequest = {
                        first_name: this.user.first_name,
                        last_name: this.user.last_name,
                        email: this.user.email,
                        role: this.user.role,
                        phone: this.user.phone || undefined,
                        specialite: this.user.specialite || undefined,
                        team_id: this.user.team_id || undefined
                    };
                    const updatedUser = await lastValueFrom(this.userService.updateUser(this.user.id, updateData));
                    const index = this.findIndexById(this.user.id);
                    this.users[index] = {
                        ...updatedUser,
                        name: getFullName(updatedUser)
                    };
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Trainer Updated',
                        life: 3000
                    });
                } else {
                    // Create new trainer
                    const userData: CreateUserRequest = {
                        first_name: this.user.first_name,
                        last_name: this.user.last_name,
                        email: this.user.email,
                        password: 'defaultPassword123',
                        role: 'formateur',
                        phone: this.user.phone || undefined,
                        specialite: this.user.specialite || undefined,
                        team_id: this.user.team_id || undefined
                    };
                    console.log('Creating trainer with data:', userData);

                    const newUser = await lastValueFrom(this.userService.createUser(userData));
                    this.users.push({
                        ...newUser,
                        name: getFullName(newUser)
                    });
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Trainer Created',
                        life: 3000
                    });
                }

                this.userDialog = false;
                this.user = {} as User;
            } catch (error) {
                console.error('Error saving trainer:', error);
                console.error('Error details:', error);

                // Show more detailed error message
                let errorMessage = 'Failed to save trainer';
                if (error && typeof error === 'object' && 'error' in error) {
                    const errorObj = error as any;
                    if (errorObj.error && errorObj.error.message) {
                        errorMessage = errorObj.error.message;
                    } else if (errorObj.message) {
                        errorMessage = errorObj.message;
                    }
                }

                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage,
                    life: 5000
                });
            }
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Please fill in all required fields (First Name, Last Name, Email)',
                life: 3000
            });
        }
    }

    async confirmDelete() {
        try {
            await lastValueFrom(this.userService.deleteUser(this.user.id));
            this.users = this.users.filter(val => val.id !== this.user.id);
            this.deleteUserDialog = false;
            this.user = {} as User;
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Trainer Deleted',
                life: 3000
            });
        } catch (error) {
            console.error('Error deleting trainer:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete trainer',
                life: 3000
            });
        }
    }

    async confirmDeleteSelected() {
        try {
            for (const user of this.selectedUsers) {
                await lastValueFrom(this.userService.deleteUser(user.id));
            }
            this.users = this.users.filter(val => !this.selectedUsers.includes(val));
            this.deleteUsersDialog = false;
            this.selectedUsers = [];
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Trainers Deleted',
                life: 3000
            });
        } catch (error) {
            console.error('Error deleting trainers:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete trainers',
                life: 3000
            });
        }
    }

    findIndexById(id: number): number {
        return this.users.findIndex(u => u.id === id);
    }
}
