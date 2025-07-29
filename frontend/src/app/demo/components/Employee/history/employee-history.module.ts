import { NgModule, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-employee-history',
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <div class="flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 class="text-900 font-semibold mb-2">Formation History</h2>
                            <p class="text-600 m-0">View your complete formation history and progress</p>
                        </div>
                        <div class="flex gap-2">
                            <p-dropdown
                                [options]="yearOptions"
                                [(ngModel)]="selectedYear"
                                placeholder="Select Year"
                                (onChange)="onYearChange()"
                                class="w-full md:w-14rem">
                            </p-dropdown>
                        </div>
                    </div>

                    <!-- Statistics Cards -->
                    <div class="grid mb-4">
                        <div class="col-12 md:col-3">
                            <div class="surface-100 border-round p-3 text-center">
                                <div class="text-2xl font-bold text-900 mb-1">{{ stats.total }}</div>
                                <div class="text-500 text-sm">Total Formations</div>
                            </div>
                        </div>
                        <div class="col-12 md:col-3">
                            <div class="surface-100 border-round p-3 text-center">
                                <div class="text-2xl font-bold text-green-500 mb-1">{{ stats.completed }}</div>
                                <div class="text-500 text-sm">Completed</div>
                            </div>
                        </div>
                        <div class="col-12 md:col-3">
                            <div class="surface-100 border-round p-3 text-center">
                                <div class="text-2xl font-bold text-blue-500 mb-1">{{ stats.hours }}</div>
                                <div class="text-500 text-sm">Total Hours</div>
                            </div>
                        </div>
                        <div class="col-12 md:col-3">
                            <div class="surface-100 border-round p-3 text-center">
                                <div class="text-2xl font-bold text-orange-500 mb-1">{{ stats.attendanceRate }}%</div>
                                <div class="text-500 text-sm">Attendance Rate</div>
                            </div>
                        </div>
                    </div>

                    <!-- Timeline -->
                    <div *ngIf="!loading">
                        <h5 class="mb-3">Formation Timeline</h5>
                        <p-timeline [value]="historyData" align="left">
                            <ng-template pTemplate="content" let-item>
                                <div class="surface-100 border-round p-3 mb-3">
                                    <div class="flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h6 class="text-900 font-semibold mb-1">{{ item.name }}</h6>
                                            <p class="text-600 text-sm m-0">{{ item.trainer }}</p>
                                        </div>
                                        <p-tag
                                            [value]="getStatusLabel(item.status)"
                                            [severity]="getStatusSeverity(item.status)">
                                        </p-tag>
                                    </div>

                                    <div class="flex align-items-center gap-3 text-sm text-500 mb-2">
                                        <span><i class="pi pi-calendar mr-1"></i>{{ formatDate(item.date) }}</span>
                                        <span><i class="pi pi-clock mr-1"></i>{{ item.duree }}h</span>
                                        <span><i class="pi pi-map-marker mr-1"></i>{{ item.room }}</span>
                                    </div>

                                    <div class="flex align-items-center justify-content-between">
                                        <div class="flex align-items-center gap-2">
                                            <span class="text-sm text-500">Attendance:</span>
                                            <p-tag
                                                [value]="getAttendanceLabel(item.attendance)"
                                                [severity]="getAttendanceSeverity(item.attendance)"
                                                size="small">
                                            </p-tag>
                                        </div>
                                        <p-button
                                            *ngIf="item.certificateUrl"
                                            icon="pi pi-download"
                                            label="Certificate"
                                            class="p-button-text p-button-sm"
                                            (click)="downloadCertificate(item)">
                                        </p-button>
                                    </div>
                                </div>
                            </ng-template>
                            <ng-template pTemplate="marker" let-item>
                                <div class="flex align-items-center justify-content-center w-2rem h-2rem border-circle"
                                     [ngClass]="getMarkerClass(item.status)">
                                    <i [class]="getMarkerIcon(item.status)"></i>
                                </div>
                            </ng-template>
                        </p-timeline>
                    </div>

                    <!-- Loading State -->
                    <div *ngIf="loading" class="flex justify-content-center align-items-center py-5">
                        <p-progressSpinner strokeWidth="4"></p-progressSpinner>
                    </div>
                </div>
            </div>
        </div>
        <p-toast></p-toast>
    `
})
export class EmployeeHistoryComponent implements OnInit {
    historyData: any[] = [];
    loading: boolean = true;
    selectedYear: number = new Date().getFullYear();
    yearOptions: any[] = [];
    stats = {
        total: 0,
        completed: 0,
        hours: 0,
        attendanceRate: 0
    };

    constructor(private messageService: MessageService) {
        // Generate year options
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= currentYear - 5; i--) {
            this.yearOptions.push({ label: i.toString(), value: i });
        }
    }

    async ngOnInit() {
        await this.loadHistory();
    }

    async loadHistory() {
        try {
            this.loading = true;

            // Mock data
            this.historyData = await this.getMockHistory();
            this.calculateStats();

            this.loading = false;
        } catch (error) {
            console.error('Error loading history:', error);
            this.loading = false;
        }
    }

    private async getMockHistory(): Promise<any[]> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        return [
            {
                id: 1,
                name: 'Angular Advanced Concepts',
                trainer: 'Syrine Daik',
                date: '2024-07-15T10:00:00',
                duree: 6,
                room: 'Room A',
                status: 'completed',
                attendance: 'present',
                certificateUrl: 'certificate-1.pdf'
            },
            {
                id: 2,
                name: 'React Fundamentals',
                trainer: 'Syrine Daik',
                date: '2024-06-20T14:00:00',
                duree: 5,
                room: 'Room C',
                status: 'completed',
                attendance: 'present',
                certificateUrl: 'certificate-2.pdf'
            },
            {
                id: 3,
                name: 'JavaScript ES6+ Features',
                trainer: 'Syrine Daik',
                date: '2024-05-10T09:00:00',
                duree: 3,
                room: 'Room B',
                status: 'completed',
                attendance: 'absent',
                certificateUrl: null
            },
            {
                id: 4,
                name: 'TypeScript Best Practices',
                trainer: 'Syrine Daik',
                date: '2024-04-15T10:00:00',
                duree: 4,
                room: 'Room A',
                status: 'completed',
                attendance: 'present',
                certificateUrl: 'certificate-4.pdf'
            }
        ];
    }

    calculateStats() {
        this.stats.total = this.historyData.length;
        this.stats.completed = this.historyData.filter(item => item.status === 'completed').length;
        this.stats.hours = this.historyData.reduce((total, item) => total + item.duree, 0);

        const presentCount = this.historyData.filter(item => item.attendance === 'present').length;
        this.stats.attendanceRate = this.stats.total > 0 ? Math.round((presentCount / this.stats.total) * 100) : 0;
    }

    async onYearChange() {
        await this.loadHistory();
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'completed': return 'Terminée';
            case 'ongoing': return 'En cours';
            case 'cancelled': return 'Annulée';
            default: return status;
        }
    }

    getStatusSeverity(status: string): string {
        switch (status) {
            case 'completed': return 'success';
            case 'ongoing': return 'warning';
            case 'cancelled': return 'danger';
            default: return 'info';
        }
    }

    getAttendanceLabel(attendance: string): string {
        switch (attendance) {
            case 'present': return 'Présent';
            case 'absent': return 'Absent';
            default: return attendance;
        }
    }

    getAttendanceSeverity(attendance: string): string {
        switch (attendance) {
            case 'present': return 'success';
            case 'absent': return 'danger';
            default: return 'info';
        }
    }

    getMarkerClass(status: string): string {
        switch (status) {
            case 'completed': return 'bg-green-500 text-white';
            case 'ongoing': return 'bg-orange-500 text-white';
            case 'cancelled': return 'bg-red-500 text-white';
            default: return 'bg-blue-500 text-white';
        }
    }

    getMarkerIcon(status: string): string {
        switch (status) {
            case 'completed': return 'pi pi-check';
            case 'ongoing': return 'pi pi-clock';
            case 'cancelled': return 'pi pi-times';
            default: return 'pi pi-circle';
        }
    }

    downloadCertificate(item: any) {
        this.messageService.add({
            severity: 'info',
            summary: 'Download',
            detail: `Downloading certificate for ${item.name}...`,
            life: 3000
        });
    }
}

@NgModule({
    declarations: [EmployeeHistoryComponent],
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        ToastModule,
        DropdownModule,
        TagModule,
        TimelineModule,
        ProgressSpinnerModule,
        RouterModule.forChild([
            { path: '', component: EmployeeHistoryComponent }
        ])
    ],
    providers: [MessageService]
})
export class EmployeeHistoryModule { }
