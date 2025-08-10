import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EmployeeService, EmployeeFormation } from '../../../../../services/employee.service';

@Component({
    selector: 'app-employee-formations-list',
    templateUrl: './employee-formations-list.component.html',
    providers: [MessageService]
})
export class EmployeeFormationsListComponent implements OnInit {
    
    formations: EmployeeFormation[] = [];
    loading: boolean = true;
    selectedStatus: string = 'all';
    
    statusOptions = [
        { label: 'All Formations', value: 'all' },
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Completed', value: 'completed' }
    ];

    constructor(
        private employeeService: EmployeeService,
        private messageService: MessageService,
        private router: Router
    ) {}

    async ngOnInit() {
        await this.loadFormations();
    }

    async loadFormations() {
        try {
            this.loading = true;
            
            // Mock data for now
            this.formations = await this.getMockFormations();
            
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

    async onStatusChange() {
        await this.loadFormations();
    }

    viewDetails(formation: EmployeeFormation) {
        console.log('🔄 Navigating to formation details:', formation.id);
        this.router.navigate(['/dashboard/employee/formations/details', formation.id]);
    }

    // Mock data method
    private async getMockFormations(): Promise<EmployeeFormation[]> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const allFormations: EmployeeFormation[] = [
            {
                id: 1,
                name: 'Angular Advanced Concepts',
                description: 'Deep dive into Angular advanced features and patterns',
                date: '2024-07-15T10:00:00',
                duree: 6,
                room: 'Room A',
                status: 'completed',
                attendance: 'present',
                participation_status: 'confirmed',
                trainer: {
                    id: 1,
                    name: 'Syrine Daik',
                    email: 'trainer@formation.com'
                },
                team: {
                    id: 1,
                    name: 'Development Team',
                    speciality: 'Web Development'
                }
            },
            {
                id: 2,
                name: 'TypeScript Best Practices',
                description: 'Learn TypeScript best practices and advanced types',
                date: '2024-07-30T14:00:00',
                duree: 4,
                room: 'Room B',
                status: 'upcoming',
                attendance: 'pending',
                participation_status: 'confirmed',
                trainer: {
                    id: 1,
                    name: 'Syrine Daik',
                    email: 'trainer@formation.com'
                },
                team: {
                    id: 1,
                    name: 'Development Team',
                    speciality: 'Web Development'
                }
            },
            {
                id: 3,
                name: 'React Fundamentals',
                description: 'Introduction to React and modern JavaScript',
                date: '2024-07-05T09:00:00',
                duree: 5,
                room: 'Room C',
                status: 'completed',
                attendance: 'absent',
                participation_status: 'confirmed',
                trainer: {
                    id: 1,
                    name: 'Syrine Daik',
                    email: 'trainer@formation.com'
                },
                team: {
                    id: 1,
                    name: 'Development Team',
                    speciality: 'Web Development'
                }
            },
            {
                id: 4,
                name: 'CSS Grid & Flexbox',
                description: 'Master modern CSS layout techniques',
                date: '2024-08-05T13:00:00',
                duree: 4,
                room: 'Room A',
                status: 'upcoming',
                attendance: 'pending',
                participation_status: 'confirmed',
                trainer: {
                    id: 1,
                    name: 'Syrine Daik',
                    email: 'trainer@formation.com'
                },
                team: {
                    id: 1,
                    name: 'Development Team',
                    speciality: 'Web Development'
                }
            }
        ];

        // Filter based on selected status
        if (this.selectedStatus === 'upcoming') {
            return allFormations.filter(f => f.status === 'upcoming');
        } else if (this.selectedStatus === 'completed') {
            return allFormations.filter(f => f.status === 'completed');
        }
        
        return allFormations;
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
