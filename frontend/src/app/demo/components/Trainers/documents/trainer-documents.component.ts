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
        this.loadDocuments();

        // Check if we should open upload dialog automatically
        this.route.queryParams.subscribe(params => {
            if (params['action'] === 'upload') {
                console.log('Auto-opening upload dialog from dashboard');
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
        this.uploadDialog = true;
        this.selectedFiles = [];
        this.uploadFormation = '';
        this.uploadDescription = '';
    }

    onFileSelect(event: any) {
        this.selectedFiles = event.files;
    }

    uploadDocuments() {
        console.log('uploadDocuments called - staying on documents page');

        if (this.selectedFiles.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select files to upload',
                life: 3000
            });
            return;
        }

        // Simulate upload
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${this.selectedFiles.length} file(s) uploaded successfully`,
            life: 3000
        });

        this.uploadDialog = false;
        this.loadDocuments();

        console.log('Documents uploaded successfully, staying on current page');
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
