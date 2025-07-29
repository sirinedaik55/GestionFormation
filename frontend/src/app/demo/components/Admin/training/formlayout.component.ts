import { Component, OnInit } from '@angular/core';
import { Formation } from '../../../../models/formation.model';
import { FormationService } from '../../../../services/formation.service';
import { TeamService } from '../../../../services/team.service';
import { UserService } from '../../../../services/user.service';
import { FormationParticipantService, FormationParticipant } from '../../../../services/formation-participant.service';
import { Team } from '../../../../models/team.model';
import { User } from '../../../../models/user.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { lastValueFrom } from 'rxjs';

@Component({
    templateUrl: './formlayout.component.html',
    providers: [MessageService]
})
export class FormLayoutComponent implements OnInit {
    formationDialog: boolean = false;
    deleteFormationDialog: boolean = false;
    deleteFormationsDialog: boolean = false;
    formations: Formation[] = [];
    formation: Formation = {} as Formation;
    selectedFormations: Formation[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    teams: Team[] = [];
    trainers: User[] = [];
    statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Pending', value: 'pending' }
    ];

    // Participants management
    participantsDialog: boolean = false;
    participants: FormationParticipant[] = [];
    selectedFormation: Formation | null = null;
    loadingParticipants: boolean = false;
    participantStatusOptions = [
        { label: 'Registered', value: 'registered' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' }
    ];

    attendanceOptions = [
        { label: 'Present', value: 'present' },
        { label: 'Absent', value: 'absent' },
        { label: 'Pending', value: 'pending' }
    ];

    constructor(
        private formationService: FormationService,
        private teamService: TeamService,
        private userService: UserService,
        private participantService: FormationParticipantService,
        private messageService: MessageService
    ) {}

    async ngOnInit() {
        try {
            // Load formations
            this.formations = await lastValueFrom(this.formationService.getFormations());

            // Load teams
            this.teams = await lastValueFrom(this.teamService.getTeams());

            // Load trainers
            const trainersData = await lastValueFrom(this.userService.getUsersByRole('formateur'));
            this.trainers = trainersData.map((trainer: any) => ({
                ...trainer,
                name: `${trainer.first_name} ${trainer.last_name}${trainer.specialite ? ' (' + trainer.specialite + ')' : ''}`
            }));
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
            { field: 'date', header: 'Date' },
            { field: 'duree', header: 'Duration (h)' },
            { field: 'equipe', header: 'Team' },
            { field: 'formateur', header: 'Trainer' }
        ];
    }

    openNew() {
        this.formation = {
            name: '',
            description: '',
            date: '',
            duree: 0,
            equipe_id: 0,
            formateur_id: 0,
            room: '',
            status: 'active'
        } as Formation;
        this.submitted = false;
        this.formationDialog = true;
    }

    onGlobalFilter(table: Table, event: Event) {
        const input = event.target as HTMLInputElement;
        table.filterGlobal(input.value, 'contains');
    }

    editFormation(formation: Formation) {
        this.formation = { ...formation };
        this.formationDialog = true;
    }

    deleteFormation(formation: Formation) {
        this.formation = formation;
        this.deleteFormationDialog = true;
    }

    deleteSelectedFormations() {
        this.deleteFormationsDialog = true;
    }

    hideDialog() {
        this.formationDialog = false;
        this.submitted = false;
    }

    async saveFormation() {
        this.submitted = true;

        if (this.formation.name?.trim() && this.formation.date && this.formation.duree > 0 &&
            this.formation.equipe_id && this.formation.formateur_id) {
            try {
                if (this.formation.id) {
                    // Update existing formation
                    const updatedFormation = await lastValueFrom(
                        this.formationService.updateFormation(this.formation.id, this.formation)
                    );
                    const index = this.findIndexById(this.formation.id);
                    this.formations[index] = updatedFormation;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Formation Updated',
                        life: 3000
                    });
                } else {
                    // Create new formation
                    const newFormation = await lastValueFrom(
                        this.formationService.createFormation({
                            name: this.formation.name,
                            description: this.formation.description || '',
                            date: this.formation.date,
                            duree: this.formation.duree,
                            equipe_id: this.formation.equipe_id,
                            formateur_id: this.formation.formateur_id,
                            room: this.formation.room
                        })
                    );
                    this.formations.push(newFormation);

                    // Force refresh the list to ensure it's up to date
                    this.formations = await lastValueFrom(this.formationService.getFormations());

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Formation Created',
                        life: 3000
                    });
                }

                this.formationDialog = false;
                this.formation = {} as Formation;
            } catch (error) {
                console.error('Error saving formation:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save formation',
                    life: 3000
                });
            }
        }
    }

    async confirmDelete() {
        try {
            await lastValueFrom(this.formationService.deleteFormation(this.formation.id));
            this.formations = this.formations.filter(val => val.id !== this.formation.id);
            this.deleteFormationDialog = false;
            this.formation = {} as Formation;
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Formation Deleted',
                life: 3000
            });
        } catch (error) {
            console.error('Error deleting formation:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete formation',
                life: 3000
            });
        }
    }

    async confirmDeleteSelected() {
        try {
            for (const formation of this.selectedFormations) {
                await lastValueFrom(this.formationService.deleteFormation(formation.id));
            }
            this.formations = this.formations.filter(val => !this.selectedFormations.includes(val));
            this.deleteFormationsDialog = false;
            this.selectedFormations = [];
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Formations Deleted',
                life: 3000
            });
        } catch (error) {
            console.error('Error deleting formations:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete formations',
                life: 3000
            });
        }
    }

    findIndexById(id: number): number {
        return this.formations.findIndex(formation => formation.id === id);
    }

    getTeamName(teamId: number): string {
        const team = this.teams.find(t => t.id === teamId);
        return team ? team.name : 'Unknown';
    }

    getTrainerName(trainerId: number): string {
        const trainer = this.trainers.find(t => t.id === trainerId);
        if (!trainer) return 'Unknown';
        return `${trainer.first_name} ${trainer.last_name}${trainer.specialite ? ' (' + trainer.specialite + ')' : ''}`;
    }

    // Participants management methods
    async viewParticipants(formation: Formation) {
        this.selectedFormation = formation;
        this.participantsDialog = true;
        this.loadingParticipants = true;

        try {
            this.participants = await lastValueFrom(this.participantService.getParticipants(formation.id));
        } catch (error) {
            console.error('Error loading participants:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load participants',
                life: 3000
            });
        } finally {
            this.loadingParticipants = false;
        }
    }

    hideParticipantsDialog() {
        this.participantsDialog = false;
        this.selectedFormation = null;
        this.participants = [];
    }

    async updateParticipantStatus(participant: FormationParticipant) {
        if (!this.selectedFormation) return;

        try {
            await lastValueFrom(this.participantService.updateParticipantStatus(
                this.selectedFormation.id,
                participant.user_id,
                { status: participant.status }
            ));

            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Participant status updated',
                life: 3000
            });
        } catch (error) {
            console.error('Error updating participant status:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update participant status',
                life: 3000
            });
        }
    }

    getParticipantCount(formationId: number): string {
        // Cette méthode sera améliorée pour charger le nombre réel de participants
        return "View";
    }

    async autoAssignTeamMembers(formation: Formation) {
        try {
            if (!formation.equipe_id) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Please select a team first',
                    life: 3000
                });
                return;
            }

            // Get team members
            const teamMembers = await lastValueFrom(this.teamService.getTeamMembers(formation.equipe_id));

            // Auto-assign all team members to the formation
            for (const member of teamMembers) {
                try {
                    await lastValueFrom(this.formationService.updateParticipantStatus(
                        formation.id,
                        member.id,
                        { status: 'confirmed' }
                    ));
                } catch (error) {
                    console.warn(`Failed to assign member ${member.id} to formation`, error);
                }
            }

            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `${teamMembers.length} team members assigned to formation`,
                life: 3000
            });

        } catch (error) {
            console.error('Error auto-assigning team members:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to auto-assign team members',
                life: 3000
            });
        }
    }



    async markAttendance(participant: FormationParticipant, attendance: 'present' | 'absent') {
        if (!this.selectedFormation) return;

        // Mettre à jour localement d'abord
        participant.attendance = attendance;

        try {
            // Ici on pourrait appeler une API pour sauvegarder l'attendance
            // Pour l'instant, on simule juste la mise à jour
            await lastValueFrom(this.participantService.updateParticipantStatus(
                this.selectedFormation.id,
                participant.user_id,
                {
                    status: participant.status,
                    // attendance: attendance // Sera ajouté quand le backend sera mis à jour
                }
            ));

            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `Marked as ${attendance}`,
                life: 3000
            });
        } catch (error) {
            console.error('Error updating attendance:', error);
            // Revenir à l'état précédent en cas d'erreur
            participant.attendance = participant.attendance === 'present' ? 'absent' : 'present';

            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update attendance',
                life: 3000
            });
        }
    }
}
