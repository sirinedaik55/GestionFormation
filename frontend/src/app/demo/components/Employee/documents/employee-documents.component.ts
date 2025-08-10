import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../../services/employee.service';

@Component({
    selector: 'app-employee-documents',
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <h5>Mes Documents</h5>
                    <p>Gérez vos documents de formation et certificats</p>
                    
                    <div class="grid">
                        <div class="col-12 md:col-6 lg:col-3">
                            <div class="card mb-0">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Total documents</span>
                                        <div class="text-900 font-medium text-xl">{{ stats?.total_documents }}</div>
                                    </div>
                                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
                                        <i class="pi pi-file text-blue-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6 lg:col-3">
                            <div class="card mb-0">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Certificats</span>
                                        <div class="text-900 font-medium text-xl">{{ stats?.certificates }}</div>
                                    </div>
                                    <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width:2.5rem;height:2.5rem">
                                        <i class="pi pi-certificate text-green-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6 lg:col-3">
                            <div class="card mb-0">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Supports de cours</span>
                                        <div class="text-900 font-medium text-xl">{{ stats?.materials }}</div>
                                    </div>
                                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2.5rem;height:2.5rem">
                                        <i class="pi pi-book text-orange-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6 lg:col-3">
                            <div class="card mb-0">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Taille totale</span>
                                        <div class="text-900 font-medium text-xl">{{ stats?.total_size }}</div>
                                    </div>
                                    <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width:2.5rem;height:2.5rem">
                                        <i class="pi pi-database text-purple-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card mt-4">
                        <div class="flex justify-content-between align-items-center mb-4">
                            <h6>Documents récents</h6>
                            <div class="flex gap-2">
                                <p-dropdown 
                                    [options]="filterOptions" 
                                    [(ngModel)]="selectedFilter" 
                                    placeholder="Filtrer par type"
                                    styleClass="w-10rem">
                                </p-dropdown>
                                <p-button label="Télécharger tout" icon="pi pi-download" styleClass="p-button-outlined"></p-button>
                            </div>
                        </div>
                        
                        <p-table [value]="filteredDocuments" [tableStyle]="{ 'min-width': '50rem' }">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Nom du document</th>
                                    <th>Type</th>
                                    <th>Formation</th>
                                    <th>Taille</th>
                                    <th>Actions</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-document>
                                <tr>
                                    <td>
                                        <div class="flex align-items-center">
                                            <i [class]="getFileIcon(document.type)" class="mr-2 text-xl"></i>
                                            <span>{{ document.name }}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <p-tag [value]="document.type" [severity]="getTypeSeverity(document.type)"></p-tag>
                                    </td>
                                    <td>{{ document.formation_id }}</td>
                                    <td>{{ document.file_size_human }}</td>
                                    <td>
                                        <div class="flex gap-1">
                                            <a [href]="document.download_url" target="_blank">
                                                <p-button icon="pi pi-download" styleClass="p-button-text p-button-sm" pTooltip="Télécharger"></p-button>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class EmployeeDocumentsComponent implements OnInit {
    stats: any = null;
    documents: any[] = [];
    filteredDocuments: any[] = [];
    selectedFilter: string = 'all';
    filterOptions = [
        { label: 'Tous les documents', value: 'all' },
        { label: 'Certificats', value: 'certificate' },
        { label: 'Supports de cours', value: 'material' },
    ];

    constructor(private employeeService: EmployeeService) {}

    ngOnInit() {
        this.employeeService.getAllDocuments().subscribe(res => {
            if (res && res.success) {
                this.stats = res.data;
                this.documents = res.data.documents;
                this.applyFilter();
            }
        });
    }

    applyFilter() {
        if (this.selectedFilter === 'all') {
            this.filteredDocuments = this.documents;
        } else {
            this.filteredDocuments = this.documents.filter(doc => doc.type === this.selectedFilter);
        }
    }

    getFileIcon(type: string): string {
        switch (type) {
            case 'certificate':
                return 'pi pi-certificate text-green-500';
            case 'material':
                return 'pi pi-book text-orange-500';
            default:
                return 'pi pi-file text-gray-500';
        }
    }

    getTypeSeverity(type: string): string {
        switch (type) {
            case 'certificate':
                return 'success';
            case 'material':
                return 'info';
            default:
                return 'info';
        }
    }
} 