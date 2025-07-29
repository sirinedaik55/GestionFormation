import { Component, OnInit } from '@angular/core';
import { User, getFullName } from '../../../../../models/user.model';
import { CreateUserRequest, UpdateUserRequest } from '../../../../../services/user.service';
import { Team } from '../../../../../models/team.model';
import { TeamService } from '../../../../../services/team.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { UserService } from '../../../../../services/user.service';
import { lastValueFrom } from 'rxjs';

@Component({
    templateUrl: './employees.component.html',
    providers: [MessageService]
})
export class EmployeesComponent implements OnInit {
    userDialog: boolean = false;
    deleteUserDialog: boolean = false;
    deleteUsersDialog: boolean = false;
    users: User[] = [];
    user: User = {} as User;
    selectedUsers: User[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    teams: Team[] = [];
    constructor(private userService: UserService, private messageService: MessageService, private teamService: TeamService) { }

    async ngOnInit() {
        try {
            // Load employees
            const users = await lastValueFrom(this.userService.getUsersByRole('employe'));
            this.users = users.map((user: any) => ({
                ...user,
                name: getFullName(user)
            }));

            // Load teams
            this.teams = await lastValueFrom(this.teamService.getTeams());
        } catch (error) {
            console.error('Error loading data:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load data',
                life: 3000
            });
        }

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Name' },
            { field: 'email', header: 'Email' },
            { field: 'team', header: 'Team' }
        ];
    }
    openNew() {
        this.user = {
            role: 'employe',
            first_name: '',
            last_name: '',
            email: ''
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
                if (this.user.id) {
                    // Update existing user
                    const updatedUser = await lastValueFrom(this.userService.updateUser(this.user.id, this.user));
                    const index = this.findIndexById(this.user.id);
                    this.users[index] = {
                        ...updatedUser,
                        name: getFullName(updatedUser)
                    };
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Employee Updated',
                        life: 3000
                    });
                } else {
                    // Create new user
                    const newUser = await lastValueFrom(this.userService.createUser({
                        ...this.user,
                        password: 'defaultPassword123' // You might want to generate or ask for password
                    } as any));
                    this.users.push({
                        ...newUser,
                        name: getFullName(newUser)
                    });
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Employee Created',
                        life: 3000
                    });
                }

                this.userDialog = false;
                this.user = {} as User;
            } catch (error) {
                console.error('Error saving user:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save employee',
                    life: 3000
                });
            }
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
                detail: 'Employee Deleted',
                life: 3000
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete employee',
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
                detail: 'Employees Deleted',
                life: 3000
            });
        } catch (error) {
            console.error('Error deleting users:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete employees',
                life: 3000
            });
        }
    }

    findIndexById(id: number): number {
        return this.users.findIndex(u => u.id === id);
    }
}
