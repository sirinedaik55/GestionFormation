import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-employee-history',
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <h5>Historique des Formations</h5>
                    <p>Historique complet de vos formations passées</p>
                    
                    <div class="grid">
                        <div class="col-12 md:col-6 lg:col-3">
                            <div class="card mb-0">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Total formations</span>
                                        <div class="text-900 font-medium text-xl">12</div>
                                    </div>
                                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
                                        <i class="pi pi-book text-blue-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6 lg:col-3">
                            <div class="card mb-0">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Formations terminées</span>
                                        <div class="text-900 font-medium text-xl">10</div>
                                    </div>
                                    <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width:2.5rem;height:2.5rem">
                                        <i class="pi pi-check-circle text-green-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6 lg:col-3">
                            <div class="card mb-0">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Certifications</span>
                                        <div class="text-900 font-medium text-xl">8</div>
                                    </div>
                                    <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width:2.5rem;height:2.5rem">
                                        <i class="pi pi-certificate text-purple-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6 lg:col-3">
                            <div class="card mb-0">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Heures de formation</span>
                                        <div class="text-900 font-medium text-xl">156h</div>
                                    </div>
                                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2.5rem;height:2.5rem">
                                        <i class="pi pi-clock text-orange-500 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card mt-4">
                        <h6>Formations terminées</h6>
                        <p-table [value]="formationsTerminees" [tableStyle]="{ 'min-width': '50rem' }">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Formation</th>
                                    <th>Formateur</th>
                                    <th>Date de fin</th>
                                    <th>Note</th>
                                    <th>Certification</th>
                                    <th>Actions</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-formation>
                                <tr>
                                    <td>{{ formation.nom }}</td>
                                    <td>{{ formation.formateur }}</td>
                                    <td>{{ formation.dateFin | date:'dd/MM/yyyy' }}</td>
                                    <td>
                                        <div class="flex align-items-center">
                                            <i class="pi pi-star-fill text-yellow-500 mr-1" *ngFor="let star of formation.note"></i>
                                            <i class="pi pi-star text-yellow-500 mr-1" *ngFor="let star of [1,2,3,4,5].slice(formation.note)"></i>
                                        </div>
                                    </td>
                                    <td>
                                        <p-tag [value]="formation.certification" [severity]="formation.certification ? 'success' : 'warning'"></p-tag>
                                    </td>
                                    <td>
                                        <p-button icon="pi pi-eye" styleClass="p-button-text p-button-sm" pTooltip="Voir les détails"></p-button>
                                        <p-button icon="pi pi-download" styleClass="p-button-text p-button-sm" pTooltip="Télécharger le certificat" *ngIf="formation.certification"></p-button>
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
export class EmployeeHistoryComponent implements OnInit {
    
    formationsTerminees = [
        {
            nom: 'JavaScript Avancé',
            formateur: 'Marie Martin',
            dateFin: new Date('2023-12-15'),
            note: 5,
            certification: 'Certifié'
        },
        {
            nom: 'React Fundamentals',
            formateur: 'Jean Dupont',
            dateFin: new Date('2023-11-20'),
            note: 4,
            certification: 'Certifié'
        },
        {
            nom: 'CSS Grid & Flexbox',
            formateur: 'Sophie Bernard',
            dateFin: new Date('2023-10-10'),
            note: 5,
            certification: 'En attente'
        },
        {
            nom: 'Git & GitHub',
            formateur: 'Pierre Durand',
            dateFin: new Date('2023-09-05'),
            note: 4,
            certification: 'Certifié'
        }
    ];

    ngOnInit() {
        // Charger l'historique des formations
    }
} 