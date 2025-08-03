import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TrainerService, TrainerFormation } from '../../../../../services/trainer.service';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-trainer-formations-list',
    templateUrl: './trainer-formations-list.component.html',
    providers: [MessageService]
})
export class TrainerFormationsListComponent implements OnInit {
    
    formations: TrainerFormation[] = [];
    loading: boolean = true;
    
    // Filters
    statusFilter: string = 'all';
    statusOptions = [
        { label: 'All', value: 'all' },
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' }
    ];

    // Table columns
    cols = [
        { field: 'name', header: 'Formation Name' },
        { field: 'date', header: 'Date' },
        { field: 'duree', header: 'Duration' },
        { field: 'participantCount', header: 'Participants' },
        { field: 'attendanceRate', header: 'Attendance Rate' },
        { field: 'status', header: 'Status' }
    ];

    constructor(
        private trainerService: TrainerService,
        private messageService: MessageService,
        private router: Router
    ) {}

    async ngOnInit() {
        await this.loadFormations();
    }

    async loadFormations() {
        try {
            this.loading = true;

            // Use real API call with fallback to mock data
            this.formations = await lastValueFrom(this.trainerService.getMyFormations());

            this.loading = false;
        } catch (error) {
            console.error('Error loading formations:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load formations',
                life: 3000
            });
            this.loading = false;
        }
    }

    // Mock data method (fallback when API fails)
    private async getMockFormations(): Promise<TrainerFormation[]> {
        await new Promise(resolve => setTimeout(resolve, 800));

        return [
            {
                id: 1,
                name: 'Angular Advanced Concepts',
                description: 'Deep dive into Angular advanced features including RxJS, state management, and performance optimization',
                date: '2024-07-25T09:00:00',
                duree: 6,
                equipe_id: 1,
                formateur_id: 1,
                room: 'Room A',
                status: 'upcoming',
                participantCount: 12,
                attendanceRate: 0
            },
            {
                id: 2,
                name: 'TypeScript Best Practices',
                description: 'Learn TypeScript best practices and advanced typing techniques',
                date: '2024-07-28T14:00:00',
                duree: 4,
                equipe_id: 2,
                formateur_id: 1,
                room: 'Room B',
                status: 'upcoming',
                participantCount: 8,
                attendanceRate: 0
            },
            {
                id: 3,
                name: 'React Fundamentals',
                description: 'Introduction to React components, hooks, and state management',
                date: '2024-07-15T10:00:00',
                duree: 5,
                equipe_id: 1,
                formateur_id: 1,
                room: 'Room C',
                status: 'completed',
                participantCount: 15,
                attendanceRate: 93
            },
            {
                id: 4,
                name: 'JavaScript ES6+',
                description: 'Modern JavaScript features and best practices',
                date: '2024-07-10T09:30:00',
                duree: 3,
                equipe_id: 3,
                formateur_id: 1,
                room: 'Room A',
                status: 'completed',
                participantCount: 10,
                attendanceRate: 80
            },
            {
                id: 5,
                name: 'CSS Grid & Flexbox',
                description: 'Master modern CSS layout techniques',
                date: '2024-07-30T13:00:00',
                duree: 4,
                equipe_id: 2,
                formateur_id: 1,
                room: 'Room B',
                status: 'upcoming',
                participantCount: 14,
                attendanceRate: 0
            },
            {
                id: 6,
                name: 'Node.js Backend Development',
                description: 'Building scalable backend applications with Node.js',
                date: '2024-07-05T14:00:00',
                duree: 8,
                equipe_id: 1,
                formateur_id: 1,
                room: 'Room D',
                status: 'completed',
                participantCount: 12,
                attendanceRate: 92
            },
            {
                id: 3,
                name: 'React Fundamentals',
                description: 'Introduction to React',
                date: '2024-01-15T10:00:00',
                duree: 8,
                equipe_id: 1,
                formateur_id: 1,
                room: 'Room C',
                status: 'completed',
                participantCount: 15,
                attendanceRate: 93
            },
            {
                id: 4,
                name: 'JavaScript ES6+',
                description: 'Modern JavaScript features',
                date: '2024-01-10T09:00:00',
                duree: 6,
                equipe_id: 2,
                formateur_id: 1,
                room: 'Room A',
                status: 'completed',
                participantCount: 10,
                attendanceRate: 80
            },
            {
                id: 5,
                name: 'Vue.js Workshop',
                description: 'Hands-on Vue.js development',
                date: '2024-02-05T13:00:00',
                duree: 5,
                equipe_id: 1,
                formateur_id: 1,
                room: 'Room D',
                status: 'upcoming',
                participantCount: 14,
                attendanceRate: 0
            }
        ];
    }

    get filteredFormations(): TrainerFormation[] {
        if (this.statusFilter === 'all') {
            return this.formations;
        }
        return this.formations.filter(f => f.status === this.statusFilter);
    }

    viewDetails(formation: TrainerFormation) {
        this.router.navigate(['/dashboard/trainer/formations/details', formation.id]);
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

    refreshFormations() {
        this.loadFormations();
        this.messageService.add({
            severity: 'success',
            summary: 'Refreshed',
            detail: 'Formations list updated',
            life: 2000
        });
    }

    navigateToCalendar() {
        this.router.navigate(['/dashboard/trainer/formations/calendar']);
    }

    manageParticipants(formation: TrainerFormation) {
        console.log('Managing participants for formation:', formation.name);
        // Navigate to participants management page
        this.router.navigate(['/dashboard/trainer/formations/participants', formation.id]);
    }

    takeAttendance(formation: TrainerFormation) {
        console.log('Taking attendance for formation:', formation.name);
        // Navigate to attendance page with formation ID
        this.router.navigate(['/dashboard/trainer/attendance'], {
            queryParams: { formationId: formation.id, formationName: formation.name }
        });
    }
}
