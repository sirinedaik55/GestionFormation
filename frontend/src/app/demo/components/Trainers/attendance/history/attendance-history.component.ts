import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface AttendanceHistory {
    id: number;
    formation: string;
    date: string;
    totalParticipants: number;
    presentCount: number;
    absentCount: number;
    attendanceRate: number;
}

@Component({
    selector: 'app-attendance-history',
    template: `
        <div class="grid">
            <!-- Header -->
            <div class="col-12">
                <div class="card">
                    <div class="flex justify-content-between align-items-center">
                        <div>
                            <h2 class="text-900 font-semibold mb-2">Attendance History</h2>
                            <p class="text-600 m-0">View attendance records for all your past formations</p>
                        </div>
                        <p-button 
                            icon="pi pi-arrow-left" 
                            label="Back to Attendance" 
                            class="p-button-outlined"
                            (click)="goBack()">
                        </p-button>
                    </div>
                </div>
            </div>

            <!-- History Table -->
            <div class="col-12">
                <div class="card">
                    <div *ngIf="loading" class="text-center py-5">
                        <p-progressSpinner strokeWidth="4"></p-progressSpinner>
                        <p class="text-500 mt-3">Loading attendance history...</p>
                    </div>

                    <div *ngIf="!loading && history.length === 0" class="text-center py-5">
                        <i class="pi pi-history text-4xl text-500 mb-3"></i>
                        <p class="text-500">No attendance history found</p>
                    </div>

                    <p-table 
                        *ngIf="!loading && history.length > 0"
                        [value]="history" 
                        [paginator]="true"
                        [rows]="10"
                        responsiveLayout="scroll">
                        
                        <ng-template pTemplate="header">
                            <tr>
                                <th pSortableColumn="formation">
                                    Formation <p-sortIcon field="formation"></p-sortIcon>
                                </th>
                                <th pSortableColumn="date">
                                    Date <p-sortIcon field="date"></p-sortIcon>
                                </th>
                                <th pSortableColumn="totalParticipants">
                                    Total Participants <p-sortIcon field="totalParticipants"></p-sortIcon>
                                </th>
                                <th pSortableColumn="presentCount">
                                    Present <p-sortIcon field="presentCount"></p-sortIcon>
                                </th>
                                <th pSortableColumn="absentCount">
                                    Absent <p-sortIcon field="absentCount"></p-sortIcon>
                                </th>
                                <th pSortableColumn="attendanceRate">
                                    Attendance Rate <p-sortIcon field="attendanceRate"></p-sortIcon>
                                </th>
                            </tr>
                        </ng-template>
                        
                        <ng-template pTemplate="body" let-record>
                            <tr>
                                <td>
                                    <div class="font-medium text-900">{{ record.formation }}</div>
                                </td>
                                <td>{{ record.date | date:'dd/MM/yyyy HH:mm' }}</td>
                                <td>
                                    <div class="flex align-items-center">
                                        <i class="pi pi-users mr-2 text-500"></i>
                                        {{ record.totalParticipants }}
                                    </div>
                                </td>
                                <td>
                                    <div class="flex align-items-center">
                                        <i class="pi pi-check-circle mr-2 text-green-500"></i>
                                        <span class="text-green-500 font-medium">{{ record.presentCount }}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex align-items-center">
                                        <i class="pi pi-times-circle mr-2 text-red-500"></i>
                                        <span class="text-red-500 font-medium">{{ record.absentCount }}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex align-items-center">
                                        <span class="mr-2 font-medium">{{ record.attendanceRate }}%</span>
                                        <p-progressBar 
                                            [value]="record.attendanceRate" 
                                            [showValue]="false"
                                            styleClass="w-6rem">
                                        </p-progressBar>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>
    `
})
export class AttendanceHistoryComponent implements OnInit {
    
    history: AttendanceHistory[] = [];
    loading: boolean = false;

    constructor(private router: Router) {}

    ngOnInit() {
        this.loadHistory();
    }

    loadHistory() {
        this.loading = true;
        
        // Mock data
        setTimeout(() => {
            this.history = [
                {
                    id: 1,
                    formation: 'React Fundamentals',
                    date: '2024-01-15T10:00:00',
                    totalParticipants: 15,
                    presentCount: 14,
                    absentCount: 1,
                    attendanceRate: 93
                },
                {
                    id: 2,
                    formation: 'JavaScript ES6+',
                    date: '2024-01-10T09:00:00',
                    totalParticipants: 10,
                    presentCount: 8,
                    absentCount: 2,
                    attendanceRate: 80
                },
                {
                    id: 3,
                    formation: 'CSS Grid & Flexbox',
                    date: '2024-01-05T14:00:00',
                    totalParticipants: 12,
                    presentCount: 11,
                    absentCount: 1,
                    attendanceRate: 92
                }
            ];
            this.loading = false;
        }, 1000);
    }

    goBack() {
        this.router.navigate(['/trainer/attendance']);
    }
}
