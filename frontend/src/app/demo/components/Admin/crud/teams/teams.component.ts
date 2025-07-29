import { Component, OnInit } from '@angular/core';
import { Team } from '../../../../../models/team.model';
import { TeamService } from '../../../../../services/team.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { lastValueFrom } from 'rxjs';

@Component({
    templateUrl: './teams.component.html',
    providers: [MessageService]
})
export class TeamsComponent implements OnInit {
    teamDialog: boolean = false;
    deleteTeamDialog: boolean = false;
    deleteTeamsDialog: boolean = false;
    teams: Team[] = [];
    team: Team = {} as Team;
    selectedTeams: Team[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private teamService: TeamService, 
        private messageService: MessageService
    ) { }

    async ngOnInit() {
        try {
            this.teams = await lastValueFrom(this.teamService.getTeams());
        } catch (error) {
            console.error('Error loading teams:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load teams',
                life: 3000
            });
        }

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Name' },
            { field: 'speciality', header: 'Speciality' }
        ];
    }

    openNew() {
        this.team = {} as Team;
        this.submitted = false;
        this.teamDialog = true;
    }

    onGlobalFilter(table: Table, event: Event) {
        const input = event.target as HTMLInputElement;
        table.filterGlobal(input.value, 'contains');
    }

    editTeam(team: Team) {
        this.team = { ...team };
        this.teamDialog = true;
    }

    deleteTeam(team: Team) {
        this.team = team;
        this.deleteTeamDialog = true;
    }

    deleteSelectedTeams() {
        this.deleteTeamsDialog = true;
    }

    hideDialog() {
        this.teamDialog = false;
        this.submitted = false;
    }

    async saveTeam() {
        this.submitted = true;
        
        if (this.team.name?.trim()) {
            try {
                if (this.team.id) {
                    // Update existing team
                    const updatedTeam = await lastValueFrom(this.teamService.updateTeam(this.team.id, {
                        name: this.team.name,
                        speciality: this.team.speciality || ''
                    }));
                    const index = this.findIndexById(this.team.id);
                    this.teams[index] = updatedTeam;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Team Updated',
                        life: 3000
                    });
                } else {
                    // Create new team
                    const newTeam = await lastValueFrom(this.teamService.addTeam({
                        name: this.team.name,
                        speciality: this.team.speciality || ''
                    }));
                    this.teams.push(newTeam);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Team Created',
                        life: 3000
                    });
                }
                
                this.teamDialog = false;
                this.team = {} as Team;
            } catch (error) {
                console.error('Error saving team:', error);
                this.messageService.add({
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'Failed to save team', 
                    life: 3000
                });
            }
        }
    }

    async confirmDelete() {
        try {
            await lastValueFrom(this.teamService.deleteTeam(this.team.id));
            this.teams = this.teams.filter(val => val.id !== this.team.id);
            this.deleteTeamDialog = false;
            this.team = {} as Team;
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Team Deleted',
                life: 3000
            });
        } catch (error) {
            console.error('Error deleting team:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete team',
                life: 3000
            });
        }
    }

    async confirmDeleteSelected() {
        try {
            for (const team of this.selectedTeams) {
                await lastValueFrom(this.teamService.deleteTeam(team.id));
            }
            this.teams = this.teams.filter(val => !this.selectedTeams.includes(val));
            this.deleteTeamsDialog = false;
            this.selectedTeams = [];
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Teams Deleted',
                life: 3000
            });
        } catch (error) {
            console.error('Error deleting teams:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete teams',
                life: 3000
            });
        }
    }

    findIndexById(id: number): number {
        return this.teams.findIndex(team => team.id === id);
    }
}
