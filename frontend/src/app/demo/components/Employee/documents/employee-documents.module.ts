import { NgModule, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-employee-documents',
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <div class="flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 class="text-900 font-semibold mb-2">Formation Documents</h2>
                            <p class="text-600 m-0">Access and download documents from your formations</p>
                        </div>
                        <div class="flex gap-2">
                            <span class="p-input-icon-left">
                                <i class="pi pi-search"></i>
                                <input
                                    type="text"
                                    pInputText
                                    placeholder="Search documents..."
                                    [(ngModel)]="searchTerm"
                                    (input)="onSearch()"
                                    class="w-full md:w-20rem">
                            </span>
                            <p-dropdown
                                [options]="typeOptions"
                                [(ngModel)]="selectedType"
                                placeholder="All Types"
                                (onChange)="onTypeChange()"
                                class="w-full md:w-12rem">
                            </p-dropdown>
                        </div>
                    </div>

                    <!-- Statistics -->
                    <div class="grid mb-4">
                        <div class="col-12 md:col-3">
                            <div class="surface-100 border-round p-3 text-center">
                                <div class="text-2xl font-bold text-900 mb-1">{{ stats.total }}</div>
                                <div class="text-500 text-sm">Total Documents</div>
                            </div>
                        </div>
                        <div class="col-12 md:col-3">
                            <div class="surface-100 border-round p-3 text-center">
                                <div class="text-2xl font-bold text-blue-500 mb-1">{{ stats.certificates }}</div>
                                <div class="text-500 text-sm">Certificates</div>
                            </div>
                        </div>
                        <div class="col-12 md:col-3">
                            <div class="surface-100 border-round p-3 text-center">
                                <div class="text-2xl font-bold text-green-500 mb-1">{{ stats.materials }}</div>
                                <div class="text-500 text-sm">Materials</div>
                            </div>
                        </div>
                        <div class="col-12 md:col-3">
                            <div class="surface-100 border-round p-3 text-center">
                                <div class="text-2xl font-bold text-orange-500 mb-1">{{ stats.totalSize }}</div>
                                <div class="text-500 text-sm">Total Size</div>
                            </div>
                        </div>
                    </div>

                    <!-- Documents List -->
                    <div *ngIf="!loading">
                        <p-dataView [value]="filteredDocuments" layout="grid">
                            <ng-template pTemplate="grid" let-document>
                                <div class="col-12 md:col-6 lg:col-4 mb-3">
                                    <div class="surface-100 border-round p-4 h-full">
                                        <div class="flex align-items-center justify-content-between mb-3">
                                            <div class="flex align-items-center">
                                                <i [class]="getFileIcon(document.type)" class="text-3xl mr-3" [ngClass]="getFileIconColor(document.type)"></i>
                                                <div>
                                                    <div class="text-900 font-medium">{{ document.name }}</div>
                                                    <div class="text-500 text-sm">{{ document.size }}</div>
                                                </div>
                                            </div>
                                            <p-tag
                                                [value]="document.category"
                                                [severity]="getCategorySeverity(document.category)"
                                                size="small">
                                            </p-tag>
                                        </div>

                                        <div class="text-600 text-sm mb-3 line-height-3">
                                            {{ document.description }}
                                        </div>

                                        <div class="flex align-items-center justify-content-between text-sm text-500 mb-3">
                                            <span><i class="pi pi-calendar mr-1"></i>{{ formatDate(document.uploadDate) }}</span>
                                            <span><i class="pi pi-user mr-1"></i>{{ document.formation }}</span>
                                        </div>

                                        <div class="flex gap-2">
                                            <p-button
                                                icon="pi pi-download"
                                                label="Download"
                                                class="p-button-sm flex-1"
                                                (click)="downloadDocument(document)">
                                            </p-button>
                                            <p-button
                                                icon="pi pi-eye"
                                                class="p-button-outlined p-button-sm"
                                                (click)="previewDocument(document)"
                                                pTooltip="Preview">
                                            </p-button>
                                        </div>
                                    </div>
                                </div>
                            </ng-template>
                        </p-dataView>

                        <!-- Empty State -->
                        <div *ngIf="filteredDocuments.length === 0" class="text-center py-5">
                            <i class="pi pi-file text-4xl text-500 mb-3"></i>
                            <h5 class="text-500">No documents found</h5>
                            <p class="text-500 m-0">Try adjusting your search criteria.</p>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div *ngIf="loading" class="flex justify-content-center align-items-center py-5">
                        <p-progressSpinner strokeWidth="4"></p-progressSpinner>
                    </div>
                </div>
            </div>
        </div>
        <p-toast></p-toast>
    `
})
export class EmployeeDocumentsComponent implements OnInit {
    documents: any[] = [];
    filteredDocuments: any[] = [];
    loading: boolean = true;
    searchTerm: string = '';
    selectedType: string = '';

    typeOptions = [
        { label: 'All Types', value: '' },
        { label: 'Certificate', value: 'certificate' },
        { label: 'Material', value: 'material' },
        { label: 'Guide', value: 'guide' }
    ];

    stats = {
        total: 0,
        certificates: 0,
        materials: 0,
        totalSize: '0 MB'
    };

    constructor(private messageService: MessageService) {}

    async ngOnInit() {
        await this.loadDocuments();
    }

    async loadDocuments() {
        try {
            this.loading = true;

            // Mock data
            this.documents = await this.getMockDocuments();
            this.filteredDocuments = [...this.documents];
            this.calculateStats();

            this.loading = false;
        } catch (error) {
            console.error('Error loading documents:', error);
            this.loading = false;
        }
    }

    private async getMockDocuments(): Promise<any[]> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        return [
            {
                id: 1,
                name: 'Angular Advanced Certificate.pdf',
                type: 'pdf',
                category: 'certificate',
                size: '2.1 MB',
                formation: 'Angular Advanced Concepts',
                uploadDate: '2024-07-15T10:00:00',
                description: 'Certificate of completion for Angular Advanced Concepts training.',
                url: 'certificates/angular-advanced.pdf'
            },
            {
                id: 2,
                name: 'Angular Advanced Guide.pdf',
                type: 'pdf',
                category: 'material',
                size: '5.3 MB',
                formation: 'Angular Advanced Concepts',
                uploadDate: '2024-07-15T10:00:00',
                description: 'Comprehensive guide covering all advanced Angular concepts and best practices.',
                url: 'materials/angular-guide.pdf'
            },
            {
                id: 3,
                name: 'RxJS Cheat Sheet.pdf',
                type: 'pdf',
                category: 'guide',
                size: '1.2 MB',
                formation: 'Angular Advanced Concepts',
                uploadDate: '2024-07-15T10:00:00',
                description: 'Quick reference guide for RxJS operators and patterns.',
                url: 'guides/rxjs-cheat-sheet.pdf'
            },
            {
                id: 4,
                name: 'Code Examples.zip',
                type: 'zip',
                category: 'material',
                size: '15.8 MB',
                formation: 'Angular Advanced Concepts',
                uploadDate: '2024-07-15T10:00:00',
                description: 'Complete code examples and exercises from the training session.',
                url: 'materials/code-examples.zip'
            },
            {
                id: 5,
                name: 'React Certificate.pdf',
                type: 'pdf',
                category: 'certificate',
                size: '2.0 MB',
                formation: 'React Fundamentals',
                uploadDate: '2024-06-20T14:00:00',
                description: 'Certificate of completion for React Fundamentals training.',
                url: 'certificates/react-fundamentals.pdf'
            },
            {
                id: 6,
                name: 'TypeScript Handbook.pdf',
                type: 'pdf',
                category: 'material',
                size: '3.1 MB',
                formation: 'TypeScript Best Practices',
                uploadDate: '2024-04-15T10:00:00',
                description: 'Complete TypeScript handbook with advanced typing techniques.',
                url: 'materials/typescript-handbook.pdf'
            }
        ];
    }

    calculateStats() {
        this.stats.total = this.documents.length;
        this.stats.certificates = this.documents.filter(doc => doc.category === 'certificate').length;
        this.stats.materials = this.documents.filter(doc => doc.category === 'material').length;

        // Calculate total size (simplified)
        const totalMB = this.documents.reduce((total, doc) => {
            const size = parseFloat(doc.size.replace(' MB', ''));
            return total + size;
        }, 0);
        this.stats.totalSize = totalMB.toFixed(1) + ' MB';
    }

    onSearch() {
        this.filterDocuments();
    }

    onTypeChange() {
        this.filterDocuments();
    }

    filterDocuments() {
        this.filteredDocuments = this.documents.filter(doc => {
            const matchesSearch = !this.searchTerm ||
                doc.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                doc.formation.toLowerCase().includes(this.searchTerm.toLowerCase());

            const matchesType = !this.selectedType || doc.category === this.selectedType;

            return matchesSearch && matchesType;
        });
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    getFileIcon(type: string): string {
        switch (type) {
            case 'pdf': return 'pi pi-file-pdf';
            case 'zip': return 'pi pi-file-archive';
            case 'doc':
            case 'docx': return 'pi pi-file-word';
            case 'xls':
            case 'xlsx': return 'pi pi-file-excel';
            default: return 'pi pi-file';
        }
    }

    getFileIconColor(type: string): string {
        switch (type) {
            case 'pdf': return 'text-red-500';
            case 'zip': return 'text-orange-500';
            case 'doc':
            case 'docx': return 'text-blue-500';
            case 'xls':
            case 'xlsx': return 'text-green-500';
            default: return 'text-500';
        }
    }

    getCategorySeverity(category: string): string {
        switch (category) {
            case 'certificate': return 'success';
            case 'material': return 'info';
            case 'guide': return 'warning';
            default: return 'secondary';
        }
    }

    downloadDocument(document: any) {
        this.messageService.add({
            severity: 'info',
            summary: 'Download Started',
            detail: `Downloading ${document.name}...`,
            life: 3000
        });
    }

    previewDocument(document: any) {
        this.messageService.add({
            severity: 'info',
            summary: 'Preview',
            detail: `Opening preview for ${document.name}...`,
            life: 3000
        });
    }
}

@NgModule({
    declarations: [EmployeeDocumentsComponent],
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        ToastModule,
        InputTextModule,
        DropdownModule,
        TagModule,
        DataViewModule,
        ProgressSpinnerModule,
        RouterModule.forChild([
            { path: '', component: EmployeeDocumentsComponent }
        ])
    ],
    providers: [MessageService]
})
export class EmployeeDocumentsModule { }
