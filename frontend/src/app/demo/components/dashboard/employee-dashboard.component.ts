import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EmployeeService, EmployeeStats, EmployeeFormation } from '../../../services/employee.service';
import { SimpleAuthService } from '../../../services/simple-auth.service';

@Component({
    selector: 'app-employee-dashboard',
    templateUrl: './employee-dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
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
        private router: Router,
        private authService: SimpleAuthService
    ) {
        this.initializeChartOptions();
    }

    async ngOnInit() {
        await this.loadStats();
    }

    async loadStats() {
        try {
            this.loading = true;
            console.log('📊 Loading employee stats...');

            // Use mock data for now (replace with real API call later)
            this.stats = await this.getMockStats();

            // Initialize charts with loaded data
            this.updateChartData();

            console.log('✅ Employee stats loaded:', this.stats);
        } catch (error) {
            console.error('❌ Error loading employee stats:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load dashboard data',
                life: 3000
            });
        } finally {
            this.loading = false;
        }
    }

    // Mock data method (to be replaced with real API calls)
    private async getMockStats(): Promise<EmployeeStats> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get current user from auth service
        const currentUser = this.authService.getCurrentUser();
        const userName = currentUser ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() : 'Employee';
        const userEmail = currentUser?.email || 'employee@formation.com';
        const userTeam = currentUser?.team || 'Development Team';

        return {
            employee_info: {
                name: userName,
                email: userEmail,
                team: userTeam,
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
                    date: '2025-08-10T14:00:00',
                    duree: 4,
                    status: 'upcoming',
                    attendance: 'pending',
                    participation_status: 'confirmed',
                    trainer: {
                        id: 2,
                        name: 'Ahmed Ben Ali',
                        email: 'trainer2@formation.com'
                    }
                }
            ],
            upcoming_formations: [
                {
                    id: 3,
                    name: 'JavaScript ES6+ Features',
                    date: '2025-08-15T09:00:00',
                    duree: 5,
                    status: 'upcoming',
                    attendance: 'pending',
                    participation_status: 'confirmed',
                    trainer: {
                        id: 3,
                        name: 'Marie Dupont',
                        email: 'trainer3@formation.com'
                    }
                },
                {
                    id: 4,
                    name: 'Docker & Containerization',
                    date: '2025-08-20T14:00:00',
                    duree: 6,
                    status: 'upcoming',
                    attendance: 'pending',
                    participation_status: 'confirmed',
                    trainer: {
                        id: 4,
                        name: 'Omar Khalil',
                        email: 'trainer4@formation.com'
                    }
                }
            ]
        };
    }

    // Navigation methods
    navigateToMyFormations() {
        this.router.navigate(['/dashboard/employee/formations']);
    }

    navigateToFormationHistory() {
        this.router.navigate(['/dashboard/employee/history']);
    }

    navigateToDocuments() {
        this.router.navigate(['/dashboard/employee/documents']);
    }

    navigateToProfile() {
        this.router.navigate(['/dashboard/employee/profile']);
    }

    // Chart initialization and data methods
    private initializeChartOptions() {
        // Attendance Chart Options
        this.attendanceChartOptions = {
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            responsive: true,
            maintainAspectRatio: false
        };

        // Monthly Chart Options
        this.monthlyChartOptions = {
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };
    }

    private updateChartData() {
        if (!this.stats) return;

        // Attendance Chart Data
        this.attendanceChartData = {
            labels: ['Present', 'Absent'],
            datasets: [{
                data: [this.stats.formation_stats.present_count, this.stats.formation_stats.absent_count],
                backgroundColor: ['#10B981', '#EF4444'],
                borderWidth: 0
            }]
        };

        // Monthly Chart Data
        this.monthlyChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Formations Completed',
                data: [2, 1, 3, 2, 4, 1],
                borderColor: '#6366F1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };
    }

    // Utility methods
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    getAttendanceLabel(attendance: string): string {
        switch (attendance) {
            case 'present': return 'Present';
            case 'absent': return 'Absent';
            case 'pending': return 'Pending';
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
}
