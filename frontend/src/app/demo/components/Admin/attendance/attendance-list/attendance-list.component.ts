import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AttendanceService, Attendance } from '../../../../../services/attendance.service';

@Component({
    selector: 'app-attendance-list',
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <div class="flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5>Liste des présences</h5>
                            <p class="text-600 m-0">Consultez toutes les présences envoyées par les formateurs</p>
                        </div>
                        <div class="flex gap-2">
                            <p-dropdown 
                                [options]="formationFilterOptions" 
                                [(ngModel)]="selectedFormation" 
                                placeholder="Filtrer par formation"
                                styleClass="w-10rem"
                                (onChange)="applyFilters()">
                            </p-dropdown>
                            <p-dropdown 
                                [options]="trainerFilterOptions" 
                                [(ngModel)]="selectedTrainer" 
                                placeholder="Filtrer par formateur"
                                styleClass="w-10rem"
                                (onChange)="applyFilters()">
                            </p-dropdown>
                            <p-dropdown 
                                [options]="statusFilterOptions" 
                                [(ngModel)]="selectedStatus" 
                                placeholder="Filtrer par statut"
                                styleClass="w-8rem"
                                (onChange)="applyFilters()">
                            </p-dropdown>
                        </div>
                    </div>

                    <!-- Statistiques -->
                    <div class="grid mb-4">
                        <div class="col-12 md:col-3">
                            <div class="card mb-0">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Total présences</span>
                                        <div class="text-900 font-medium text-xl">{{ stats.total }}</div>
                                    </div>
                                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
                                        <i class="pi pi-users text-blue-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 md:col-3">
                            <div class="card mb-0">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Présents</span>
                                        <div class="text-900 font-medium text-xl">{{ stats.present }}</div>
                                    </div>
                                    <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width:2.5rem;height:2.5rem">
                                        <i class="pi pi-check text-green-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 md:col-3">
                            <div class="card mb-0">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Absents</span>
                                        <div class="text-900 font-medium text-xl">{{ stats.absent }}</div>
                                    </div>
                                    <div class="flex align-items-center justify-content-center bg-red-100 border-round" style="width:2.5rem;height:2.5rem">
                                        <i class="pi pi-times text-red-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 md:col-3">
                            <div class="card mb-0">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Taux de présence</span>
                                        <div class="text-900 font-medium text-xl">{{ stats.rate }}%</div>
                                    </div>
                                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2.5rem;height:2.5rem">
                                        <i class="pi pi-percentage text-orange-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Table des présences -->
                    <p-table 
                        [value]="filteredAttendances" 
                        [tableStyle]="{ 'min-width': '50rem' }"
                        [loading]="loading"
                        [paginator]="true" 
                        [rows]="10"
                        [showCurrentPageReport]="true"
                        currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} présences"
                        [rowsPerPageOptions]="[10,25,50]">
                        
                        <ng-template pTemplate="header">
                            <tr>
                                <th>Formation</th>
                                <th>Participant</th>
                                <th>Formateur</th>
                                <th>Statut</th>
                                <th>Date prise</th>
                                <th>Envoyé à admin</th>
                                <th>Notes</th>
                            </tr>
                        </ng-template>
                        
                        <ng-template pTemplate="body" let-attendance>
                            <tr>
                                <td>
                                    <div class="font-medium">{{ attendance.formation?.name }}</div>
                                    <div class="text-500 text-sm">{{ formatDate(attendance.formation?.date) }}</div>
                                </td>
                                <td>
                                    <div class="font-medium">{{ attendance.user?.first_name }} {{ attendance.user?.last_name }}</div>
                                    <div class="text-500 text-sm">{{ attendance.user?.email }}</div>
                                </td>
                                <td>
                                    <div class="font-medium">{{ attendance.trainer?.first_name }} {{ attendance.trainer?.last_name }}</div>
                                </td>
                                <td>
                                    <p-tag 
                                        [value]="getStatusLabel(attendance.status)" 
                                        [severity]="getStatusColor(attendance.status)">
                                    </p-tag>
                                </td>
                                <td>{{ formatDate(attendance.taken_at) }}</td>
                                <td>
                                    <p-tag 
                                        [value]="attendance.sent_to_admin ? 'Oui' : 'Non'" 
                                        [severity]="attendance.sent_to_admin ? 'success' : 'warning'">
                                    </p-tag>
                                </td>
                                <td>
                                    <span *ngIf="attendance.notes" class="text-500">{{ attendance.notes }}</span>
                                    <span *ngIf="!attendance.notes" class="text-400">-</span>
                                </td>
                            </tr>
                        </ng-template>
                        
                        <ng-template pTemplate="emptymessage">
                            <tr>
                                <td colspan="7" class="text-center p-4">
                                    <i class="pi pi-inbox text-400 text-4xl mb-3"></i>
                                    <div class="text-500">Aucune présence trouvée</div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>
    `
})
export class AttendanceListComponent implements OnInit {
    attendances: Attendance[] = [];
    filteredAttendances: Attendance[] = [];
    loading = false;
    
    // Filtres
    selectedFormation: any = null;
    selectedTrainer: any = null;
    selectedStatus: any = null;
    
    formationFilterOptions: any[] = [];
    trainerFilterOptions: any[] = [];
    statusFilterOptions = [
        { label: 'Tous', value: null },
        { label: 'Présent', value: 'present' },
        { label: 'Absent', value: 'absent' },
        { label: 'En retard', value: 'late' }
    ];

    constructor(
        private attendanceService: AttendanceService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadAttendances();
    }

    loadAttendances() {
        this.loading = true;
        this.attendanceService.getAllAttendances().subscribe({
            next: (attendances) => {
                this.attendances = attendances;
                this.filteredAttendances = attendances;
                this.updateStats();
                this.updateFilterOptions();
                this.loading = false;
            },
            error: (error) => {
                console.error('Erreur lors du chargement des présences:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger les présences'
                });
                this.loading = false;
            }
        });
    }

    applyFilters() {
        this.filteredAttendances = this.attendances.filter(attendance => {
            let matches = true;
            
            if (this.selectedFormation && attendance.formation_id !== this.selectedFormation.value) {
                matches = false;
            }
            
            if (this.selectedTrainer && attendance.taken_by !== this.selectedTrainer.value) {
                matches = false;
            }
            
            if (this.selectedStatus && attendance.status !== this.selectedStatus.value) {
                matches = false;
            }
            
            return matches;
        });
        
        this.updateStats();
    }

    updateFilterOptions() {
        // Options de formation
        const formations = [...new Set(this.attendances.map(a => a.formation_id))];
        this.formationFilterOptions = [
            { label: 'Toutes les formations', value: null },
            ...formations.map(id => {
                const formation = this.attendances.find(a => a.formation_id === id)?.formation;
                return {
                    label: formation?.name || `Formation ${id}`,
                    value: id
                };
            })
        ];

        // Options de formateur
        const trainers = [...new Set(this.attendances.map(a => a.taken_by))];
        this.trainerFilterOptions = [
            { label: 'Tous les formateurs', value: null },
            ...trainers.map(id => {
                const trainer = this.attendances.find(a => a.taken_by === id)?.trainer;
                return {
                    label: trainer ? `${trainer.first_name} ${trainer.last_name}` : `Formateur ${id}`,
                    value: id
                };
            })
        ];
    }

    updateStats() {
        const stats = this.attendanceService.getAttendanceStats(this.filteredAttendances);
        this.stats = stats;
    }

    getStatusLabel(status: string): string {
        return this.attendanceService.getStatusLabel(status);
    }

    getStatusColor(status: string): string {
        return this.attendanceService.getStatusColor(status);
    }

    formatDate(dateString?: string): string {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    get stats(): any {
        return this.attendanceService.getAttendanceStats(this.filteredAttendances);
    }
} 