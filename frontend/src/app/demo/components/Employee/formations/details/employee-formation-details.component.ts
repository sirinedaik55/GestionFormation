import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormationService } from '../../../../../services/formation.service';

@Component({
    selector: 'app-employee-formation-details',
    template: `
        <div class="grid" *ngIf="!loading && formation">
            <!-- Header -->
            <div class="col-12">
                <div class="card">
                    <div class="flex justify-content-between align-items-center">
                        <div class="flex align-items-center gap-3">
                            <p-button
                                icon="pi pi-arrow-left"
                                class="p-button-rounded p-button-text"
                                (click)="goBack()">
                            </p-button>
                            <div>
                                <h2 class="text-900 font-semibold mb-1">{{ formation.name }}</h2>
                                <p class="text-600 m-0">Formation Details</p>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <p-tag
                                [value]="getStatusLabel(formation.status)"
                                [severity]="getStatusSeverity(formation.status)">
                            </p-tag>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Formation Information -->
            <div class="col-12 lg:col-8">
                <div class="card">
                    <h5>Formation Information</h5>

                    <div class="grid">
                        <div class="col-12 md:col-6">
                            <label class="block text-900 font-medium mb-2">Date & Time</label>
                            <div class="flex align-items-center">
                                <i class="pi pi-calendar text-500 mr-2"></i>
                                <span class="text-900">{{ formatDate(formation.date) }}</span>
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <label class="block text-900 font-medium mb-2">Duration</label>
                            <div class="flex align-items-center">
                                <i class="pi pi-clock text-500 mr-2"></i>
                                <span class="text-900">{{ formation.duree }} hours</span>
                            </div>
                        </div>

                        <div class="col-12 md:col-6" *ngIf="formation.room">
                            <label class="block text-900 font-medium mb-2">Room</label>
                            <div class="flex align-items-center">
                                <i class="pi pi-map-marker text-500 mr-2"></i>
                                <span class="text-900">{{ formation.room }}</span>
                            </div>
                        </div>

                        <div class="col-12 md:col-6" *ngIf="formation.trainer">
                            <label class="block text-900 font-medium mb-2">Trainer</label>
                            <div class="flex align-items-center">
                                <i class="pi pi-user text-500 mr-2"></i>
                                <span class="text-900">{{ formation.trainer.name }}</span>
                            </div>
                        </div>

                        <div class="col-12">
                            <label class="block text-900 font-medium mb-2">Description</label>
                            <p class="text-900 line-height-3">{{ formation.description }}</p>
                        </div>
                    </div>
                </div>

                <!-- Learning Objectives -->
                <div class="card" *ngIf="formation.objectives && formation.objectives.length > 0">
                    <h5>Learning Objectives</h5>
                    <ul class="list-none p-0 m-0">
                        <li *ngFor="let objective of formation.objectives" class="flex align-items-start mb-3">
                            <i class="pi pi-check-circle text-green-500 mr-3 mt-1"></i>
                            <span class="text-900">{{ objective }}</span>
                        </li>
                    </ul>
                </div>

                <!-- Training Materials -->
                <div class="card" *ngIf="formation.materials && formation.materials.length > 0">
                    <h5>Training Materials</h5>
                    <div class="grid">
                        <div class="col-12 md:col-6" *ngFor="let material of formation.materials">
                            <div class="surface-100 border-round p-3 flex align-items-center justify-content-between">
                                <div class="flex align-items-center">
                                    <i class="pi pi-file text-2xl text-500 mr-3"></i>
                                    <div>
                                        <div class="text-900 font-medium">{{ material.name }}</div>
                                        <div class="text-500 text-sm">{{ material.size }}</div>
                                    </div>
                                </div>
                                <p-button
                                    icon="pi pi-download"
                                    class="p-button-rounded p-button-text"
                                    (click)="downloadMaterial(material)"
                                    pTooltip="Download">
                                </p-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Participation Status -->
            <div class="col-12 lg:col-4">
                <div class="card">
                    <h5>My Participation</h5>

                    <div class="mb-4">
                        <label class="block text-900 font-medium mb-2">Registration Status</label>
                        <p-tag
                            [value]="formation.participation_status"
                            severity="success"
                            class="text-capitalize">
                        </p-tag>
                    </div>

                    <div class="mb-4">
                        <label class="block text-900 font-medium mb-2">Attendance</label>
                        <p-tag
                            [value]="getAttendanceLabel(formation.attendance)"
                            [severity]="getAttendanceSeverity(formation.attendance)">
                        </p-tag>
                    </div>

                    <div class="mb-4" *ngIf="formation.team">
                        <label class="block text-900 font-medium mb-2">Team</label>
                        <div class="flex align-items-center">
                            <i class="pi pi-users text-500 mr-2"></i>
                            <div>
                                <div class="text-900 font-medium">{{ formation.team.name }}</div>
                                <div class="text-500 text-sm">{{ formation.team.speciality }}</div>
                            </div>
                        </div>
                    </div>

                    <div *ngIf="formation.trainer">
                        <label class="block text-900 font-medium mb-2">Trainer Information</label>
                        <div class="surface-100 border-round p-3">
                            <div class="flex align-items-center mb-2">
                                <i class="pi pi-user text-500 mr-2"></i>
                                <span class="text-900 font-medium">{{ formation.trainer.name }}</span>
                            </div>
                            <div class="flex align-items-center mb-2">
                                <i class="pi pi-envelope text-500 mr-2"></i>
                                <span class="text-600">{{ formation.trainer.email }}</span>
                            </div>
                            <div class="flex align-items-center" *ngIf="formation.trainer.specialite">
                                <i class="pi pi-star text-500 mr-2"></i>
                                <span class="text-600">{{ formation.trainer.specialite }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="flex justify-content-center align-items-center" style="height: 50vh;">
            <div class="text-center">
                <p-progressSpinner strokeWidth="4"></p-progressSpinner>
                <p class="text-500 mt-3">Loading formation details...</p>
            </div>
        </div>

        <p-toast></p-toast>
    `,
    providers: [MessageService]
})
export class EmployeeFormationDetailsComponent implements OnInit {

    formationId!: number;
    formation: any = null;
    loading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private formationService: FormationService
    ) {}

    async ngOnInit() {
        this.formationId = +this.route.snapshot.params['id'];
        await this.loadFormationDetails();
    }

    async loadFormationDetails() {
        try {
            this.loading = true;

            // Use real API call
            this.formationService.getMyFormationDetails(this.formationId).subscribe({
                next: (formation) => {
                    this.formation = formation;
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading formation details:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load formation details',
                        life: 3000
                    });
                    this.loading = false;
                }
            });
        } catch (error) {
            console.error('Error loading formation details:', error);
            this.loading = false;
        }
    }



    goBack() {
        this.router.navigate(['/employee/formations']);
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
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

    getAttendanceLabel(attendance: string): string {
        switch (attendance) {
            case 'present': return 'Présent';
            case 'absent': return 'Absent';
            case 'pending': return 'En attente';
            default: return attendance;
        }
    }

    getAttendanceSeverity(attendance: string): string {
        switch (attendance) {
            case 'present': return 'success';
            case 'absent': return 'danger';
            case 'pending': return 'warning';
            default: return 'info';
        }
    }

    downloadMaterial(material: any) {
        this.messageService.add({
            severity: 'info',
            summary: 'Download',
            detail: `Downloading ${material.name}...`,
            life: 3000
        });
    }
}
