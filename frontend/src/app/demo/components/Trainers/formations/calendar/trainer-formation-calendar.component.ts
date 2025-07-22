import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainerFormation } from '../../../../../services/trainer.service';

@Component({
    selector: 'app-trainer-formation-calendar',
    template: `
        <div class="grid">
            <!-- Header -->
            <div class="col-12">
                <div class="card">
                    <div class="flex justify-content-between align-items-center">
                        <div>
                            <h2 class="text-900 font-semibold mb-2">Formation Calendar</h2>
                            <p class="text-600 m-0">View your formations in calendar format</p>
                        </div>
                        <div class="flex gap-2">
                            <p-button
                                icon="pi pi-list"
                                label="List View"
                                class="p-button-outlined"
                                (click)="navigateToList()">
                            </p-button>
                            <p-button
                                icon="pi pi-refresh"
                                label="Refresh"
                                class="p-button-outlined"
                                (click)="loadFormations()">
                            </p-button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Calendar View -->
            <div class="col-12">
                <div class="card">
                    <div *ngIf="loading" class="text-center py-5">
                        <p-progressSpinner strokeWidth="4"></p-progressSpinner>
                        <p class="text-500 mt-3">Loading calendar...</p>
                    </div>

                    <div *ngIf="!loading && formations.length === 0" class="text-center py-8">
                        <i class="pi pi-calendar text-6xl text-500 mb-4"></i>
                        <h4 class="text-500">No formations scheduled</h4>
                        <p class="text-500">You don't have any formations scheduled yet</p>
                    </div>

                    <!-- Simple Calendar Grid View -->
                    <div *ngIf="!loading && formations.length > 0">
                        <h5 class="mb-4">Upcoming Formations</h5>

                        <!-- Calendar Legend -->
                        <div class="flex gap-4 mb-4">
                            <div class="flex align-items-center">
                                <div class="w-1rem h-1rem bg-blue-500 border-round mr-2"></div>
                                <span class="text-sm">Upcoming</span>
                            </div>
                            <div class="flex align-items-center">
                                <div class="w-1rem h-1rem bg-orange-500 border-round mr-2"></div>
                                <span class="text-sm">Ongoing</span>
                            </div>
                            <div class="flex align-items-center">
                                <div class="w-1rem h-1rem bg-green-500 border-round mr-2"></div>
                                <span class="text-sm">Completed</span>
                            </div>
                            <div class="flex align-items-center">
                                <div class="w-1rem h-1rem bg-red-500 border-round mr-2"></div>
                                <span class="text-sm">Cancelled</span>
                            </div>
                        </div>

                        <!-- Formations Timeline -->
                        <div class="grid">
                            <div class="col-12 md:col-6 lg:col-4" *ngFor="let formation of formations">
                                <div class="card border-1 surface-border p-3 cursor-pointer hover:surface-hover transition-colors transition-duration-150"
                                     (click)="viewFormationDetails(formation)">

                                    <!-- Formation Header -->
                                    <div class="flex justify-content-between align-items-start mb-3">
                                        <div class="flex align-items-center">
                                            <div [ngClass]="'w-1rem h-1rem border-round mr-3 bg-' + (formation.status === 'upcoming' ? 'blue' : formation.status === 'ongoing' ? 'orange' : formation.status === 'completed' ? 'green' : 'red') + '-500'"></div>
                                            <div>
                                                <h6 class="text-900 font-semibold mb-1">{{ formation.name }}</h6>
                                                <p class="text-500 text-sm m-0">{{ formation.description }}</p>
                                            </div>
                                        </div>
                                        <p-tag
                                            [value]="getStatusLabel(formation.status)"
                                            [severity]="getStatusSeverity(formation.status)"
                                            class="text-xs">
                                        </p-tag>
                                    </div>

                                    <!-- Formation Details -->
                                    <div class="grid text-sm">
                                        <div class="col-12">
                                            <div class="flex align-items-center mb-2">
                                                <i class="pi pi-calendar text-500 mr-2"></i>
                                                <span class="font-medium">{{ formatDate(formation.date) }}</span>
                                            </div>
                                        </div>

                                        <div class="col-6">
                                            <div class="flex align-items-center mb-2">
                                                <i class="pi pi-clock text-500 mr-2"></i>
                                                <span>{{ formation.duree }}h</span>
                                            </div>
                                        </div>

                                        <div class="col-6">
                                            <div class="flex align-items-center mb-2">
                                                <i class="pi pi-map-marker text-500 mr-2"></i>
                                                <span>{{ formation.room }}</span>
                                            </div>
                                        </div>

                                        <div class="col-12">
                                            <div class="flex align-items-center">
                                                <i class="pi pi-users text-500 mr-2"></i>
                                                <span>{{ formation.participantCount }} participants</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Action Buttons -->
                                    <div class="flex gap-2 mt-3">
                                        <p-button
                                            icon="pi pi-eye"
                                            class="p-button-rounded p-button-text p-button-sm"
                                            pTooltip="View Details">
                                        </p-button>
                                        <p-button
                                            icon="pi pi-check-square"
                                            class="p-button-rounded p-button-text p-button-sm"
                                            pTooltip="Take Attendance"
                                            [disabled]="formation.status !== 'upcoming' && formation.status !== 'ongoing'">
                                        </p-button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Monthly View Placeholder -->
                        <div class="mt-6">
                            <div class="surface-100 border-round p-4 text-center">
                                <i class="pi pi-calendar-plus text-3xl text-500 mb-3"></i>
                                <h5 class="text-500 mb-2">Full Calendar View</h5>
                                <p class="text-500 text-sm m-0">
                                    A complete monthly calendar view with drag & drop functionality will be implemented here.
                                    <br>This will include integration with popular calendar libraries like FullCalendar.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class TrainerFormationCalendarComponent implements OnInit {

    formations: TrainerFormation[] = [];
    loading: boolean = true;

    // Calendar view data
    currentDate: Date = new Date();
    calendarEvents: any[] = [];

    constructor(private router: Router) {}

    async ngOnInit() {
        await this.loadFormations();
        this.prepareCalendarEvents();
    }

    async loadFormations() {
        this.loading = true;

        // Mock data for calendar
        await new Promise(resolve => setTimeout(resolve, 800));

        this.formations = [
            {
                id: 1,
                name: 'Angular Advanced Concepts',
                description: 'Deep dive into Angular advanced features',
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
                description: 'Learn TypeScript best practices',
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
                description: 'Introduction to React components',
                date: '2024-07-30T10:00:00',
                duree: 5,
                equipe_id: 1,
                formateur_id: 1,
                room: 'Room C',
                status: 'upcoming',
                participantCount: 15,
                attendanceRate: 0
            }
        ];

        this.loading = false;
    }

    prepareCalendarEvents() {
        this.calendarEvents = this.formations.map(formation => ({
            id: formation.id,
            title: formation.name,
            start: new Date(formation.date),
            end: new Date(new Date(formation.date).getTime() + formation.duree * 60 * 60 * 1000),
            backgroundColor: this.getStatusColor(formation.status),
            borderColor: this.getStatusColor(formation.status),
            extendedProps: {
                description: formation.description,
                room: formation.room,
                participants: formation.participantCount,
                status: formation.status
            }
        }));
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'upcoming': return '#3B82F6';
            case 'ongoing': return '#F59E0B';
            case 'completed': return '#10B981';
            case 'cancelled': return '#EF4444';
            default: return '#6B7280';
        }
    }

    navigateToList() {
        this.router.navigate(['/trainer/formations/list']);
    }

    viewFormationDetails(formation: TrainerFormation) {
        this.router.navigate(['/trainer/formations/details', formation.id]);
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
}
