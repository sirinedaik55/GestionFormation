import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TrainerService, TrainerStats, TrainerFormation } from '../../../../services/trainer.service';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-trainer-dashboard',
    templateUrl: './trainer-dashboard.component.html',
    providers: [MessageService]
})
export class TrainerDashboardComponent implements OnInit {
    
    // Statistics
    stats: TrainerStats = {
        totalFormations: 0,
        upcomingFormations: 0,
        completedFormations: 0,
        totalParticipants: 0,
        averageAttendanceRate: 0,
        thisMonthFormations: 0
    };

    // Formations data
    upcomingFormations: TrainerFormation[] = [];
    recentFormations: TrainerFormation[] = [];
    
    // Loading states
    loadingStats: boolean = true;
    loadingFormations: boolean = true;

    // Chart data
    attendanceChartData: any;
    attendanceChartOptions: any;
    
    monthlyFormationsData: any;
    monthlyFormationsOptions: any;

    constructor(
        private trainerService: TrainerService,
        private messageService: MessageService,
        private router: Router
    ) {
        this.initializeChartOptions();
    }

    async ngOnInit() {
        await this.loadDashboardData();
    }

    async loadDashboardData() {
        try {
            // Load statistics
            this.loadingStats = true;

            // For now, use mock data until backend is ready
            this.stats = await this.getMockStats();
            this.loadingStats = false;

            // Load upcoming formations
            this.loadingFormations = true;
            this.upcomingFormations = await this.getMockUpcomingFormations();

            // Load recent completed formations (last 5)
            this.recentFormations = await this.getMockRecentFormations();

            this.loadingFormations = false;

            // Update charts
            this.updateCharts();

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load dashboard data',
                life: 3000
            });
            this.loadingStats = false;
            this.loadingFormations = false;
        }
    }

    // Mock data methods (to be replaced with real API calls)
    private async getMockStats(): Promise<TrainerStats> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            totalFormations: 24,
            upcomingFormations: 5,
            completedFormations: 19,
            totalParticipants: 156,
            averageAttendanceRate: 87,
            thisMonthFormations: 3
        };
    }

    private async getMockUpcomingFormations(): Promise<TrainerFormation[]> {
        await new Promise(resolve => setTimeout(resolve, 800));

        return [
            {
                id: 1,
                name: 'Angular Advanced Concepts',
                description: 'Deep dive into Angular advanced features',
                date: '2024-01-25T09:00:00',
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
                date: '2024-01-28T14:00:00',
                duree: 4,
                equipe_id: 2,
                formateur_id: 1,
                room: 'Room B',
                status: 'upcoming',
                participantCount: 8,
                attendanceRate: 0
            }
        ];
    }

    private async getMockRecentFormations(): Promise<TrainerFormation[]> {
        await new Promise(resolve => setTimeout(resolve, 600));

        return [
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
            }
        ];
    }

    private initializeChartOptions() {
        // Attendance chart options
        this.attendanceChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: '#495057'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        // Monthly formations chart options
        this.monthlyFormationsOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: '#495057'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
    }

    private updateCharts() {
        // Update attendance chart with recent formations data
        this.attendanceChartData = {
            labels: this.recentFormations.map(f => f.name?.substring(0, 20) + '...' || 'Formation'),
            datasets: [
                {
                    label: 'Attendance Rate (%)',
                    data: this.recentFormations.map(f => f.attendanceRate || 0),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    fill: true
                }
            ]
        };

        // Update monthly formations chart (mock data for now)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        this.monthlyFormationsData = {
            labels: months,
            datasets: [
                {
                    label: 'Formations',
                    data: [3, 5, 2, 4, 6, 3], // Mock data
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2
                }
            ]
        };
    }

    // Quick actions
    navigateToFormations() {
        this.router.navigate(['/trainer/formations']);
    }

    navigateToAttendance() {
        this.router.navigate(['/trainer/attendance']);
    }

    navigateToDocuments() {
        console.log('navigateToDocuments called - navigating to documents page and opening upload dialog');
        this.router.navigate(['/trainer/documents'], { queryParams: { action: 'upload' } });
    }

    navigateToReports() {
        console.log('navigateToReports called - navigating to reports page and opening create dialog');
        this.router.navigate(['/trainer/reports'], { queryParams: { action: 'create' } });
    }

    // Utility methods
    getFormationStatusSeverity(status: string): string {
        switch (status) {
            case 'upcoming': return 'info';
            case 'ongoing': return 'warning';
            case 'completed': return 'success';
            case 'cancelled': return 'danger';
            default: return 'info';
        }
    }

    getFormationStatusLabel(status: string): string {
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

    refreshDashboard() {
        this.loadDashboardData();
        this.messageService.add({
            severity: 'success',
            summary: 'Refreshed',
            detail: 'Dashboard data updated',
            life: 2000
        });
    }
}
