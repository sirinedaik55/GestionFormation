import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { TrainerService, TrainerFormation } from '../../../../../services/trainer.service';
import { FormationParticipant } from '../../../../../services/formation-participant.service';

@Component({
    selector: 'app-trainer-formation-details',
    templateUrl: './trainer-formation-details.component.html',
    providers: [MessageService]
})
export class TrainerFormationDetailsComponent implements OnInit {

    @ViewChild('fileUpload') fileUpload!: FileUpload;

    formation: TrainerFormation | null = null;
    participants: FormationParticipant[] = [];
    loading: boolean = true;
    loadingParticipants: boolean = false;

    // Edit mode
    editMode: boolean = false;

    // Notification dialog
    notificationDialog: boolean = false;
    notificationSubject: string = '';
    notificationMessage: string = '';

    // Upload dialog
    uploadDialog: boolean = false;
    selectedFiles: File[] = [];
    uploadFormation: string = '';
    uploadDescription: string = '';
    notificationRecipients: string = 'all'; // 'all', 'registered', 'absent'
    editFormation: any = {};

    // Make Math available in template
    Math = Math;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private trainerService: TrainerService,
        private messageService: MessageService
    ) {}

    async ngOnInit() {
        const formationId = this.route.snapshot.params['id'];
        if (formationId) {
            await this.loadFormationDetails(parseInt(formationId));
        }
    }

    async loadFormationDetails(formationId: number) {
        try {
            this.loading = true;
            
            // Mock data for now
            this.formation = await this.getMockFormationDetails(formationId);
            this.editFormation = { ...this.formation };
            
            // Load participants
            await this.loadParticipants(formationId);
            
            this.loading = false;
        } catch (error) {
            console.error('Error loading formation details:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load formation details',
                life: 3000
            });
            this.loading = false;
        }
    }

    async loadParticipants(formationId: number) {
        try {
            this.loadingParticipants = true;
            
            // Mock participants data
            this.participants = await this.getMockParticipants(formationId);
            
            this.loadingParticipants = false;
        } catch (error) {
            console.error('Error loading participants:', error);
            this.loadingParticipants = false;
        }
    }

    // Mock data methods
    private async getMockFormationDetails(id: number): Promise<TrainerFormation> {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const formations = [
            {
                id: 1,
                name: 'Angular Advanced Concepts',
                description: 'Deep dive into Angular advanced features including RxJS, state management, and performance optimization',
                date: '2024-01-25T09:00:00',
                duree: 6,
                equipe_id: 1,
                formateur_id: 1,
                room: 'Room A',
                status: 'upcoming' as const,
                participantCount: 12,
                attendanceRate: 0
            },
            {
                id: 2,
                name: 'TypeScript Best Practices',
                description: 'Learn TypeScript best practices and advanced typing techniques',
                date: '2024-01-28T14:00:00',
                duree: 4,
                equipe_id: 2,
                formateur_id: 1,
                room: 'Room B',
                status: 'upcoming' as const,
                participantCount: 8,
                attendanceRate: 0
            }
        ];
        
        return formations.find(f => f.id === id) || formations[0];
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
                status: 'registered',
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

    toggleEditMode() {
        this.editMode = !this.editMode;
        if (!this.editMode && this.formation) {
            this.editFormation = { ...this.formation };
        }
    }

    async saveChanges() {
        if (!this.formation) return;

        try {
            // Here you would call the API to update the formation
            // await this.trainerService.updateFormationDetails(this.formation.id, this.editFormation);
            
            // For now, just update locally
            this.formation = { ...this.formation, ...this.editFormation };
            this.editMode = false;
            
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Formation updated successfully',
                life: 3000
            });
        } catch (error) {
            console.error('Error updating formation:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update formation',
                life: 3000
            });
        }
    }

    goBack() {
        this.router.navigate(['/dashboard/trainer/formations']);
    }

    navigateToAttendance() {
        if (this.formation) {
            this.router.navigate(['/dashboard/trainer/attendance'], {
                queryParams: {
                    formationId: this.formation.id,
                    formationName: this.formation.name
                }
            });
        }
    }

    uploadDocuments() {
        console.log('📤 Upload Documents button clicked');
        console.log('📋 Formation details:', {
            id: this.formation?.id,
            name: this.formation?.name,
            status: this.formation?.status
        });

        // Open upload dialog directly
        this.uploadDialog = true;
        this.uploadFormation = this.formation?.name || '';
        this.selectedFiles = [];
        this.uploadDescription = '';

        console.log('🔄 Upload dialog opened');
    }

    onFileSelect(event: any) {
        console.log('📁 Files selected:', event);
        console.log('📁 Event files:', event.files);
        console.log('📁 Current files:', event.currentFiles);

        // PrimeNG FileUpload peut retourner les fichiers dans event.files ou event.currentFiles
        this.selectedFiles = event.files || event.currentFiles || [];

        // Assurer que c'est un tableau
        if (!Array.isArray(this.selectedFiles)) {
            this.selectedFiles = [];
        }

        console.log('📁 Selected files array:', this.selectedFiles);

        if (this.selectedFiles.length > 0) {
            try {
                const fileNames = this.selectedFiles.map(f => f.name).join(', ');
                console.log('✅ Selected files:', fileNames);

                // Afficher un message de confirmation
                this.messageService.add({
                    severity: 'info',
                    summary: 'Files Selected',
                    detail: `${this.selectedFiles.length} file(s) selected`,
                    life: 2000
                });
            } catch (error) {
                console.error('❌ Error processing selected files:', error);
                this.selectedFiles = [];
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error processing selected files',
                    life: 3000
                });
            }
        }
    }

    clearFiles() {
        console.log('🗑️ Clearing selected files');
        this.selectedFiles = [];
        this.messageService.add({
            severity: 'info',
            summary: 'Files Cleared',
            detail: 'All selected files have been cleared',
            life: 2000
        });
    }

    cancelUpload() {
        console.log('❌ Upload cancelled');
        this.uploadDialog = false;
        this.selectedFiles = [];
        this.uploadFormation = '';
        this.uploadDescription = '';
    }

    performUpload() {
        console.log('📤 Performing upload');
        console.log('📤 Selected files count:', this.selectedFiles.length);
        console.log('📤 Selected files:', this.selectedFiles);

        // Récupérer les fichiers du composant PrimeNG si selectedFiles est vide
        let filesToUpload = this.selectedFiles;
        if (filesToUpload.length === 0 && this.fileUpload && this.fileUpload.files) {
            filesToUpload = this.fileUpload.files;
            console.log('📤 Files from PrimeNG component:', filesToUpload);
        }

        if (filesToUpload.length === 0) {
            console.log('❌ No files detected in selectedFiles array or PrimeNG component');
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select files to upload',
                life: 3000
            });
            return;
        }

        if (!this.uploadFormation.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter formation name',
                life: 3000
            });
            return;
        }

        console.log('📋 Upload details:', {
            formation: this.uploadFormation,
            description: this.uploadDescription,
            filesCount: filesToUpload.length,
            files: filesToUpload.map(f => ({ name: f.name, size: f.size }))
        });

        // Simulate upload process
        const fileNames = filesToUpload.map(f => f.name).join(', ');

        // Show success message
        this.messageService.add({
            severity: 'success',
            summary: 'Upload Successful',
            detail: `${filesToUpload.length} file(s) uploaded successfully: ${fileNames}`,
            life: 5000
        });

        // Close dialog and reset form
        this.uploadDialog = false;
        this.selectedFiles = [];
        this.uploadFormation = '';
        this.uploadDescription = '';

        console.log('✅ Upload completed successfully');
    }



    sendNotification() {
        console.log('🔔 Opening notification dialog for formation:', this.formation?.name);
        this.notificationSubject = `Formation: ${this.formation?.name}`;
        this.notificationMessage = '';
        this.notificationRecipients = 'all';
        this.notificationDialog = true;
    }

    sendNotificationMessage() {
        console.log('📤 Sending notification:', {
            subject: this.notificationSubject,
            message: this.notificationMessage,
            recipients: this.notificationRecipients,
            formation: this.formation?.name
        });

        // Simulate sending notification
        this.messageService.add({
            severity: 'success',
            summary: 'Notification Sent',
            detail: `Notification sent to ${this.getRecipientsLabel()} for "${this.formation?.name}"`,
            life: 3000
        });

        this.notificationDialog = false;
    }

    getRecipientsLabel(): string {
        switch (this.notificationRecipients) {
            case 'all': return 'all participants';
            case 'registered': return 'registered participants';
            case 'absent': return 'absent participants';
            default: return 'participants';
        }
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

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getParticipantStatusSeverity(status: string): string {
        switch (status) {
            case 'confirmed': return 'success';
            case 'registered': return 'info';
            case 'cancelled': return 'danger';
            default: return 'info';
        }
    }
}
