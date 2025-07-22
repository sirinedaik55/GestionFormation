import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TrainerService, TrainerFormation } from '../../../../services/trainer.service';
import { FormationParticipant } from '../../../../services/formation-participant.service';

interface AttendanceRecord {
    participant: FormationParticipant;
    attendance: 'present' | 'absent' | 'pending';
    notes?: string;
}

@Component({
    selector: 'app-trainer-attendance',
    templateUrl: './trainer-attendance.component.html',
    providers: [MessageService, ConfirmationService]
})
export class TrainerAttendanceComponent implements OnInit {
    
    selectedFormation: TrainerFormation | null = null;
    availableFormations: TrainerFormation[] = [];
    attendanceRecords: AttendanceRecord[] = [];
    
    loading: boolean = false;
    loadingParticipants: boolean = false;
    submitting: boolean = false;
    
    // Search and filter
    searchTerm: string = '';
    attendanceFilter: string = 'all';
    
    attendanceOptions = [
        { label: 'All', value: 'all' },
        { label: 'Present', value: 'present' },
        { label: 'Absent', value: 'absent' },
        { label: 'Pending', value: 'pending' }
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private trainerService: TrainerService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    async ngOnInit() {
        await this.loadAvailableFormations();
        
        // Check if a formation ID was passed as query parameter
        const formationId = this.route.snapshot.queryParams['formationId'];
        if (formationId) {
            const formation = this.availableFormations.find(f => f.id === parseInt(formationId));
            if (formation) {
                this.selectedFormation = formation;
                await this.loadParticipants();
            }
        }
    }

    async loadAvailableFormations() {
        try {
            this.loading = true;
            
            // Load formations that can have attendance taken (upcoming or ongoing)
            this.availableFormations = await this.getMockUpcomingFormations();
            
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

    async onFormationChange() {
        if (this.selectedFormation) {
            await this.loadParticipants();
        } else {
            this.attendanceRecords = [];
        }
    }

    async loadParticipants() {
        if (!this.selectedFormation) return;

        try {
            this.loadingParticipants = true;
            
            // Load participants for the selected formation
            const participants = await this.getMockParticipants(this.selectedFormation.id);
            
            // Initialize attendance records
            this.attendanceRecords = participants.map(participant => ({
                participant,
                attendance: 'pending' as const,
                notes: ''
            }));
            
            this.loadingParticipants = false;
        } catch (error) {
            console.error('Error loading participants:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load participants',
                life: 3000
            });
            this.loadingParticipants = false;
        }
    }

    // Mock data methods
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
                status: 'ongoing',
                participantCount: 8,
                attendanceRate: 0
            }
        ];
    }

    private async getMockParticipants(formationId: number): Promise<FormationParticipant[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return [
            {
                id: 1,
                formation_id: formationId,
                user_id: 1,
                status: 'confirmed',
                attendance: 'pending',
                user: {
                    id: 1,
                    first_name: 'John',
                    last_name: 'Doe',
                    email: 'john.doe@company.com',
                    role: 'employe',
                    team: {
                        id: 1,
                        name: 'Development Team',
                        speciality: 'Web Development'
                    }
                }
            },
            {
                id: 2,
                formation_id: formationId,
                user_id: 2,
                status: 'confirmed',
                attendance: 'pending',
                user: {
                    id: 2,
                    first_name: 'Jane',
                    last_name: 'Smith',
                    email: 'jane.smith@company.com',
                    role: 'employe',
                    team: {
                        id: 1,
                        name: 'Development Team',
                        speciality: 'Web Development'
                    }
                }
            },
            {
                id: 3,
                formation_id: formationId,
                user_id: 3,
                status: 'confirmed',
                attendance: 'pending',
                user: {
                    id: 3,
                    first_name: 'Mike',
                    last_name: 'Johnson',
                    email: 'mike.johnson@company.com',
                    role: 'employe',
                    team: {
                        id: 2,
                        name: 'UI/UX Team',
                        speciality: 'Design'
                    }
                }
            }
        ];
    }

    get filteredAttendanceRecords(): AttendanceRecord[] {
        let filtered = this.attendanceRecords;

        // Filter by search term
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(record => 
                record.participant.user?.first_name?.toLowerCase().includes(term) ||
                record.participant.user?.last_name?.toLowerCase().includes(term) ||
                record.participant.user?.email?.toLowerCase().includes(term)
            );
        }

        // Filter by attendance status
        if (this.attendanceFilter !== 'all') {
            filtered = filtered.filter(record => record.attendance === this.attendanceFilter);
        }

        return filtered;
    }

    markAttendance(record: AttendanceRecord, attendance: 'present' | 'absent') {
        record.attendance = attendance;
    }

    markAllPresent() {
        this.attendanceRecords.forEach(record => {
            record.attendance = 'present';
        });
        
        this.messageService.add({
            severity: 'info',
            summary: 'Updated',
            detail: 'All participants marked as present',
            life: 2000
        });
    }

    markAllAbsent() {
        this.attendanceRecords.forEach(record => {
            record.attendance = 'absent';
        });
        
        this.messageService.add({
            severity: 'info',
            summary: 'Updated',
            detail: 'All participants marked as absent',
            life: 2000
        });
    }

    resetAttendance() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to reset all attendance records?',
            header: 'Reset Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.attendanceRecords.forEach(record => {
                    record.attendance = 'pending';
                    record.notes = '';
                });
                
                this.messageService.add({
                    severity: 'info',
                    summary: 'Reset',
                    detail: 'All attendance records have been reset',
                    life: 2000
                });
            }
        });
    }

    async submitAttendance() {
        if (!this.selectedFormation) return;

        // Check if all attendance is marked
        const pendingCount = this.attendanceRecords.filter(r => r.attendance === 'pending').length;
        
        if (pendingCount > 0) {
            this.confirmationService.confirm({
                message: `${pendingCount} participants still have pending attendance. Do you want to continue?`,
                header: 'Incomplete Attendance',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.performSubmit();
                }
            });
        } else {
            this.performSubmit();
        }
    }

    private async performSubmit() {
        if (!this.selectedFormation) return;

        try {
            this.submitting = true;
            
            // Prepare attendance data
            const attendanceData = this.attendanceRecords.map(record => ({
                user_id: record.participant.user_id,
                attendance: record.attendance,
                notes: record.notes
            }));

            // Here you would call the API
            // await this.trainerService.submitAttendance(this.selectedFormation.id, attendanceData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Attendance submitted successfully',
                life: 3000
            });
            
            // Navigate back to formations or dashboard
            this.router.navigate(['/trainer/formations']);
            
        } catch (error) {
            console.error('Error submitting attendance:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to submit attendance',
                life: 3000
            });
        } finally {
            this.submitting = false;
        }
    }

    getAttendanceStats() {
        const total = this.attendanceRecords.length;
        const present = this.attendanceRecords.filter(r => r.attendance === 'present').length;
        const absent = this.attendanceRecords.filter(r => r.attendance === 'absent').length;
        const pending = this.attendanceRecords.filter(r => r.attendance === 'pending').length;
        
        return { total, present, absent, pending };
    }

    navigateToHistory() {
        this.router.navigate(['/trainer/attendance/history']);
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
}
