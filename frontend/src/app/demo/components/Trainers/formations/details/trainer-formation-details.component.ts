import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TrainerService, TrainerFormation } from '../../../../../services/trainer.service';
import { FormationParticipant } from '../../../../../services/formation-participant.service';

@Component({
    selector: 'app-trainer-formation-details',
    templateUrl: './trainer-formation-details.component.html',
    providers: [MessageService]
})
export class TrainerFormationDetailsComponent implements OnInit {

    formation: TrainerFormation | null = null;
    participants: FormationParticipant[] = [];
    loading: boolean = true;
    loadingParticipants: boolean = false;

    // Edit mode
    editMode: boolean = false;
    editFormation: any = {};

    // Make Math available in template
    Math = Math;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private trainerService: TrainerService,
        private messageService: MessageService
    ) {}

    async ngOnInit() {
        const formationId = this.route.snapshot.params['id'];
        if (formationId) {
            await this.loadFormationDetails(parseInt(formationId));
        }
    }

    async loadFormationDetails(formationId: number) {
        try {
            this.loading = true;
            
            // Mock data for now
            this.formation = await this.getMockFormationDetails(formationId);
            this.editFormation = { ...this.formation };
            
            // Load participants
            await this.loadParticipants(formationId);
            
            this.loading = false;
        } catch (error) {
            console.error('Error loading formation details:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load formation details',
                life: 3000
            });
            this.loading = false;
        }
    }

    async loadParticipants(formationId: number) {
        try {
            this.loadingParticipants = true;
            
            // Mock participants data
            this.participants = await this.getMockParticipants(formationId);
            
            this.loadingParticipants = false;
        } catch (error) {
            console.error('Error loading participants:', error);
            this.loadingParticipants = false;
        }
    }

    // Mock data methods
    private async getMockFormationDetails(id: number): Promise<TrainerFormation> {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const formations = [
            {
                id: 1,
                name: 'Angular Advanced Concepts',
                description: 'Deep dive into Angular advanced features including RxJS, state management, and performance optimization',
                date: '2024-01-25T09:00:00',
                duree: 6,
                equipe_id: 1,
                formateur_id: 1,
                room: 'Room A',
                status: 'upcoming' as const,
                participantCount: 12,
                attendanceRate: 0
            },
            {
                id: 2,
                name: 'TypeScript Best Practices',
                description: 'Learn TypeScript best practices and advanced typing techniques',
                date: '2024-01-28T14:00:00',
                duree: 4,
                equipe_id: 2,
                formateur_id: 1,
                room: 'Room B',
                status: 'upcoming' as const,
                participantCount: 8,
                attendanceRate: 0
            }
        ];
        
        return formations.find(f => f.id === id) || formations[0];
    }

    private async getMockParticipants(formationId: number): Promise<FormationParticipant[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return [
            {
                id: 1,
                formation_id: formationId,
                user_id: 1,
                status: 'confirmed',
                attendance: 'pending',
                user: {
                    id: 1,
                    first_name: 'John',
                    last_name: 'Doe',
                    email: 'john.doe@company.com',
                    role: 'employe',
                    team: {
                        id: 1,
                        name: 'Development Team',
                        speciality: 'Web Development'
                    }
                }
            },
            {
                id: 2,
                formation_id: formationId,
                user_id: 2,
                status: 'confirmed',
                attendance: 'pending',
                user: {
                    id: 2,
                    first_name: 'Jane',
                    last_name: 'Smith',
                    email: 'jane.smith@company.com',
                    role: 'employe',
                    team: {
                        id: 1,
                        name: 'Development Team',
                        speciality: 'Web Development'
                    }
                }
            },
            {
                id: 3,
                formation_id: formationId,
                user_id: 3,
                status: 'registered',
                attendance: 'pending',
                user: {
                    id: 3,
                    first_name: 'Mike',
                    last_name: 'Johnson',
                    email: 'mike.johnson@company.com',
                    role: 'employe',
                    team: {
                        id: 2,
                        name: 'UI/UX Team',
                        speciality: 'Design'
                    }
                }
            }
        ];
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        if (!this.editMode && this.formation) {
            this.editFormation = { ...this.formation };
        }
    }

    async saveChanges() {
        if (!this.formation) return;

        try {
            // Here you would call the API to update the formation
            // await this.trainerService.updateFormationDetails(this.formation.id, this.editFormation);
            
            // For now, just update locally
            this.formation = { ...this.formation, ...this.editFormation };
            this.editMode = false;
            
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Formation updated successfully',
                life: 3000
            });
        } catch (error) {
            console.error('Error updating formation:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update formation',
                life: 3000
            });
        }
    }

    goBack() {
        this.router.navigate(['/trainer/formations']);
    }

    navigateToAttendance() {
        if (this.formation) {
            this.router.navigate(['/trainer/attendance'], { 
                queryParams: { formationId: this.formation.id } 
            });
        }
    }

    getStatusSeverity(status: string): string {
        switch (status) {
            case 'upcoming': return 'info';
            case 'ongoing': return 'warning';
            case 'completed': return 'success';
            case 'cancelled': return 'danger';
            default: return 'info';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'upcoming': return 'À venir';
            case 'ongoing': return 'En cours';
            case 'completed': return 'Terminée';
            case 'cancelled': return 'Annulée';
            default: return status;
        }
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getParticipantStatusSeverity(status: string): string {
        switch (status) {
            case 'confirmed': return 'success';
            case 'registered': return 'info';
            case 'cancelled': return 'danger';
            default: return 'info';
        }
    }
}
