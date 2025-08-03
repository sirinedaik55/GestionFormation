import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

interface Document {
    id: number;
    name: string;
    type: string;
    size: string;
    formation: string;
    uploadDate: string;
    status: 'active' | 'archived';
}

@Component({
    selector: 'app-trainer-documents',
    templateUrl: './trainer-documents.component.html',
    providers: [MessageService]
})
export class TrainerDocumentsComponent implements OnInit {
    
    documents: Document[] = [];
    loading: boolean = false;
    uploadDialog: boolean = false;
    
    // Upload form
    selectedFiles: File[] = [];
    uploadFormation: string = '';
    uploadDescription: string = '';

    constructor(
        private messageService: MessageService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        console.log('🚀 TrainerDocumentsComponent ngOnInit - Component loaded');
        this.loadDocuments();

        // Check if we should open upload dialog automatically
        this.route.queryParams.subscribe(params => {
            console.log('📋 Query params received:', params);
            if (params['action'] === 'upload') {
                console.log('🔄 Auto-opening upload dialog from dashboard');
                setTimeout(() => {
                    this.showUploadDialog();
                }, 500); // Small delay to ensure component is fully loaded
            }
        });
    }

    loadDocuments() {
        this.loading = true;
        
        // Mock data
        setTimeout(() => {
            this.documents = [
                {
                    id: 1,
                    name: 'Angular_Advanced_Slides.pdf',
                    type: 'PDF',
                    size: '2.5 MB',
                    formation: 'Angular Advanced Concepts',
                    uploadDate: '2024-01-20',
                    status: 'active'
                },
                {
                    id: 2,
                    name: 'TypeScript_Exercises.zip',
                    type: 'ZIP',
                    size: '1.8 MB',
                    formation: 'TypeScript Best Practices',
                    uploadDate: '2024-01-18',
                    status: 'active'
                }
            ];
            this.loading = false;
        }, 1000);
    }

    showUploadDialog() {
        console.log('🔄 Opening upload dialog');
        this.uploadDialog = true;
        this.selectedFiles = [];
        this.uploadFormation = '';
        this.uploadDescription = '';

        // Check if formation info was passed via query params
        this.route.queryParams.subscribe(params => {
            if (params['formationName']) {
                this.uploadFormation = params['formationName'];
                console.log('📋 Pre-filled formation:', this.uploadFormation);
            }
        });
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

        // Show selected files info
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

    cancelUpload() {
        console.log('❌ Upload cancelled');
        this.uploadDialog = false;
        this.selectedFiles = [];
        this.uploadFormation = '';
        this.uploadDescription = '';
    }

    uploadDocuments() {
        console.log('📤 uploadDocuments called');

        // Validation
        if (this.selectedFiles.length === 0) {
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
            filesCount: this.selectedFiles.length,
            files: this.selectedFiles.map(f => ({ name: f.name, size: f.size }))
        });

        // Simulate upload process
        const fileNames = this.selectedFiles.map(f => f.name).join(', ');

        this.messageService.add({
            severity: 'success',
            summary: 'Upload Successful',
            detail: `${this.selectedFiles.length} file(s) uploaded: ${fileNames}`,
            life: 5000
        });

        // Close dialog and reset
        this.uploadDialog = false;
        this.selectedFiles = [];
        this.uploadFormation = '';
        this.uploadDescription = '';

        // Reload documents list
        this.loadDocuments();

        console.log('✅ Documents uploaded successfully');
    }

    downloadDocument(doc: Document) {
        this.messageService.add({
            severity: 'info',
            summary: 'Download',
            detail: `Downloading ${doc.name}`,
            life: 2000
        });
    }



    deleteDocument(doc: Document) {
        this.documents = this.documents.filter(d => d.id !== doc.id);
        this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: `${doc.name} has been deleted`,
            life: 3000
        });
    }

    getFileIcon(type: string): string {
        switch (type.toLowerCase()) {
            case 'pdf': return 'pi pi-file-pdf';
            case 'doc':
            case 'docx': return 'pi pi-file-word';
            case 'ppt':
            case 'pptx': return 'pi pi-file-powerpoint';
            case 'xls':
            case 'xlsx': return 'pi pi-file-excel';
            case 'zip':
            case 'rar': return 'pi pi-file-archive';
            default: return 'pi pi-file';
        }
    }
}
