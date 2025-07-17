import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { DocumentsService, Document, DocumentUpload } from '../../../../services/documents.service';
import { FormationService } from '../../../../services/formation.service';

@Component({
  templateUrl: './documents.component.html',
  providers: [MessageService, ConfirmationService]
})
export class DocumentsComponent implements OnInit {
  documents: Document[] = [];
  formations: any[] = [];
  loading: boolean = false;
  uploadDialog: boolean = false;
  
  // Upload form
  selectedFormationId: number | null = null;
  selectedFile: File | null = null;
  customFileName: string = '';
  uploading: boolean = false;

  constructor(
    private documentsService: DocumentsService,
    private formationService: FormationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  async ngOnInit() {
    await this.loadDocuments();
    await this.loadFormations();
  }

  async loadDocuments() {
    this.loading = true;
    try {
      this.documents = await lastValueFrom(this.documentsService.getDocuments());
    } catch (error) {
      console.error('Error loading documents:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load documents',
        life: 3000
      });
    } finally {
      this.loading = false;
    }
  }

  async loadFormations() {
    try {
      this.formations = await this.formationService.getFormations();
    } catch (error) {
      console.error('Error loading formations:', error);
    }
  }

  openUploadDialog() {
    this.uploadDialog = true;
    this.resetUploadForm();
  }

  hideUploadDialog() {
    this.uploadDialog = false;
    this.resetUploadForm();
  }

  resetUploadForm() {
    this.selectedFormationId = null;
    this.selectedFile = null;
    this.customFileName = '';
    this.uploading = false;
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
      if (!this.customFileName) {
        this.customFileName = file.name;
      }
    }
  }

  async uploadDocument() {
    if (!this.selectedFile || !this.selectedFormationId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a file and formation',
        life: 3000
      });
      return;
    }

    this.uploading = true;
    try {
      const upload: DocumentUpload = {
        formation_id: this.selectedFormationId,
        file: this.selectedFile,
        name: this.customFileName || this.selectedFile.name
      };

      await lastValueFrom(this.documentsService.uploadDocument(upload));
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Document uploaded successfully',
        life: 3000
      });
      
      this.hideUploadDialog();
      await this.loadDocuments();
      
    } catch (error) {
      console.error('Error uploading document:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to upload document',
        life: 3000
      });
    } finally {
      this.uploading = false;
    }
  }

  async deleteDocument(document: Document) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${document.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await lastValueFrom(this.documentsService.deleteDocument(document.id));
          
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Document deleted successfully',
            life: 3000
          });
          
          await this.loadDocuments();
          
        } catch (error) {
          console.error('Error deleting document:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete document',
            life: 3000
          });
        }
      }
    });
  }

  async downloadDocument(document: Document) {
    try {
      const blob = await lastValueFrom(this.documentsService.downloadDocument(document.id));
      
      // Créer URL temporaire et déclencher téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.name;
      link.click();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading document:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to download document',
        life: 3000
      });
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFormationName(formationId: number): string {
    const formation = this.formations.find(f => f.id === formationId);
    return formation ? formation.name : 'Unknown';
  }
}