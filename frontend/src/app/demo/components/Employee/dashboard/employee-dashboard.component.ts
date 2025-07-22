import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EmployeeService, EmployeeStats, EmployeeFormation } from '../../../../services/employee.service';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-employee-dashboard',
    templateUrl: './employee-dashboard.component.html',
    providers: [MessageService]
})
export class EmployeeDashboardComponent implements OnInit {
    
    stats: EmployeeStats | null = null;
    loading: boolean = true;
    
    // Chart data
    attendanceChartData: any;
    attendanceChartOptions: any;
    
    monthlyChartData: any;
    monthlyChartOptions: any;

    constructor(
        private employeeService: EmployeeService,
        private messageService: MessageService,
        private router: Router
    ) {
        this.initializeChartOptions();
    }

    async ngOnInit() {
        await this.loadStats();
    }

    async loadStats() {
        try {
            this.loading = true;
            
            // Use mock data for now (API will be implemented later)
            this.stats = await this.getMockStats();
            
            // Update charts with real data
            this.updateCharts();
            
            this.loading = false;
        } catch (error) {
            console.error('Error loading stats:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load dashboard data',
                life: 3000
            });
            this.loading = false;
        }
    }

    // Mock data method (to be replaced with real API calls)
    private async getMockStats(): Promise<EmployeeStats> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            employee_info: {
                name: 'John Doe',
                email: 'employee@formation.com',
                team: 'Development Team',
                team_speciality: 'Web Development'
            },
            formation_stats: {
                total_formations: 12,
                completed_formations: 8,
                upcoming_formations: 4,
                attendance_rate: 87,
                present_count: 7,
                absent_count: 1
            },
            recent_formations: [
                {
                    id: 1,
                    name: 'Angular Advanced Concepts',
                    date: '2024-07-15T10:00:00',
                    duree: 6,
                    status: 'completed',
                    attendance: 'present',
                    participation_status: 'confirmed',
                    trainer: {
                        id: 1,
                        name: 'Syrine Daik',
                        email: 'trainer@formation.com'
                    }
                },
                {
                    id: 2,
                    name: 'TypeScript Best Practices',
                    date: '2024-07-10T14:00:00',
                    duree: 4,
                    status: 'completed',
                    attendance: 'present',
                    participation_status: 'confirmed',
                    trainer: {
                        id: 1,
                        name: 'Syrine Daik',
                        email: 'trainer@formation.com'
                    }
                },
                {
                    id: 3,
                    name: 'React Fundamentals',
                    date: '2024-07-05T09:00:00',
                    duree: 5,
                    status: 'completed',
                    attendance: 'absent',
                    participation_status: 'confirmed',
                    trainer: {
                        id: 1,
                        name: 'Syrine Daik',
                        email: 'trainer@formation.com'
                    }
                }
            ],
            upcoming_formations: [
                {
                    id: 4,
                    name: 'CSS Grid & Flexbox',
                    date: '2024-07-30T13:00:00',
                    duree: 4,
                    room: 'Room B',
                    status: 'upcoming',
                    attendance: 'pending',
                    participation_status: 'confirmed',
                    trainer: {
                        id: 1,
                        name: 'Syrine Daik',
                        email: 'trainer@formation.com'
                    }
                },
                {
                    id: 5,
                    name: 'Node.js Backend Development',
                    date: '2024-08-05T09:00:00',
                    duree: 8,
                    room: 'Room A',
                    status: 'upcoming',
                    attendance: 'pending',
                    participation_status: 'confirmed',
                    trainer: {
                        id: 1,
                        name: 'Syrine Daik',
                        email: 'trainer@formation.com'
                    }
                }
            ]
        };
    }

    private initializeChartOptions() {
        // Attendance Chart Options
        this.attendanceChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: '#495057'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        };

        // Monthly Chart Options
        this.monthlyChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        };
    }

    private updateCharts() {
        if (!this.stats) return;

        // Attendance Chart Data
        this.attendanceChartData = {
            labels: ['Present', 'Absent'],
            datasets: [
                {
                    data: [this.stats.formation_stats.present_count, this.stats.formation_stats.absent_count],
                    backgroundColor: ['#10B981', '#EF4444'],
                    hoverBackgroundColor: ['#059669', '#DC2626']
                }
            ]
        };

        // Monthly Activity Chart Data (mock data)
        this.monthlyChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [
                {
                    label: 'Formations Attended',
                    data: [2, 1, 3, 2, 4, 1, 3],
                    fill: false,
                    backgroundColor: '#3B82F6',
                    borderColor: '#3B82F6',
                    tension: 0.4
                }
            ]
        };
    }

    // Navigation methods
    navigateToFormations() {
        this.router.navigate(['/employee/formations']);
    }

    navigateToHistory() {
        this.router.navigate(['/employee/history']);
    }

    navigateToDocuments() {
        this.router.navigate(['/employee/documents']);
    }

    navigateToProfile() {
        this.router.navigate(['/employee/profile']);
    }

    viewFormationDetails(formation: EmployeeFormation) {
        this.router.navigate(['/employee/formations/details', formation.id]);
    }

    // Utility methods
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

    getAttendanceSeverity(attendance: string): string {
        switch (attendance) {
            case 'present': return 'success';
            case 'absent': return 'danger';
            case 'pending': return 'warning';
            default: return 'info';
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
}
