import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-employee-profile',
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <h5>Mon Profil</h5>
                    <p>Gérez vos informations personnelles et préférences</p>
                    
                    <div class="grid">
                        <div class="col-12 lg:col-4">
                            <div class="card">
                                <div class="text-center mb-4">
                                    <div class="w-8rem h-8rem border-circle bg-blue-100 flex align-items-center justify-content-center mx-auto mb-3">
                                        <i class="pi pi-user text-blue-500 text-6xl"></i>
                                    </div>
                                    <h4>{{ user.nom }} {{ user.prenom }}</h4>
                                    <p class="text-500">{{ user.role }}</p>
                                    <p-button label="Changer la photo" icon="pi pi-camera" styleClass="p-button-outlined p-button-sm"></p-button>
                                </div>
                                
                                <div class="border-top-1 surface-border pt-4">
                                    <h6>Informations de contact</h6>
                                    <div class="flex flex-column gap-2">
                                        <div class="flex align-items-center">
                                            <i class="pi pi-envelope text-500 mr-2"></i>
                                            <span>{{ user.email }}</span>
                                        </div>
                                        <div class="flex align-items-center">
                                            <i class="pi pi-phone text-500 mr-2"></i>
                                            <span>{{ user.telephone }}</span>
                                        </div>
                                        <div class="flex align-items-center">
                                            <i class="pi pi-map-marker text-500 mr-2"></i>
                                            <span>{{ user.departement }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-12 lg:col-8">
                            <div class="card">
                                <h6>Informations personnelles</h6>
                                <div class="grid">
                                    <div class="col-12 md:col-6">
                                        <label class="block text-900 font-medium mb-2">Prénom</label>
                                        <input pInputText type="text" [(ngModel)]="user.prenom" class="w-full" />
                                    </div>
                                    <div class="col-12 md:col-6">
                                        <label class="block text-900 font-medium mb-2">Nom</label>
                                        <input pInputText type="text" [(ngModel)]="user.nom" class="w-full" />
                                    </div>
                                    <div class="col-12 md:col-6">
                                        <label class="block text-900 font-medium mb-2">Email</label>
                                        <input pInputText type="email" [(ngModel)]="user.email" class="w-full" />
                                    </div>
                                    <div class="col-12 md:col-6">
                                        <label class="block text-900 font-medium mb-2">Téléphone</label>
                                        <input pInputText type="tel" [(ngModel)]="user.telephone" class="w-full" />
                                    </div>
                                    <div class="col-12 md:col-6">
                                        <label class="block text-900 font-medium mb-2">Département</label>
                                        <input pInputText type="text" [(ngModel)]="user.departement" class="w-full" />
                                    </div>
                                    <div class="col-12 md:col-6">
                                        <label class="block text-900 font-medium mb-2">Poste</label>
                                        <input pInputText type="text" [(ngModel)]="user.poste" class="w-full" />
                                    </div>
                                </div>
                                
                                <div class="flex justify-content-end mt-4">
                                    <p-button label="Sauvegarder" icon="pi pi-check" (click)="saveProfile()"></p-button>
                                </div>
                            </div>
                            
                            <div class="card mt-4">
                                <h6>Statistiques de formation</h6>
                                <div class="grid">
                                    <div class="col-12 md:col-3">
                                        <div class="text-center">
                                            <div class="text-900 font-bold text-xl">{{ stats.totalFormations }}</div>
                                            <div class="text-500">Formations suivies</div>
                                        </div>
                                    </div>
                                    <div class="col-12 md:col-3">
                                        <div class="text-center">
                                            <div class="text-900 font-bold text-xl">{{ stats.certifications }}</div>
                                            <div class="text-500">Certifications</div>
                                        </div>
                                    </div>
                                    <div class="col-12 md:col-3">
                                        <div class="text-center">
                                            <div class="text-900 font-bold text-xl">{{ stats.heuresFormation }}h</div>
                                            <div class="text-500">Heures de formation</div>
                                        </div>
                                    </div>
                                    <div class="col-12 md:col-3">
                                        <div class="text-center">
                                            <div class="text-900 font-bold text-xl">{{ stats.noteMoyenne }}/5</div>
                                            <div class="text-500">Note moyenne</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card mt-4">
                                <h6>Formations récentes</h6>
                                <p-table [value]="formationsRecentes" [tableStyle]="{ 'min-width': '50rem' }">
                                    <ng-template pTemplate="header">
                                        <tr>
                                            <th>Formation</th>
                                            <th>Date</th>
                                            <th>Statut</th>
                                            <th>Note</th>
                                        </tr>
                                    </ng-template>
                                    <ng-template pTemplate="body" let-formation>
                                        <tr>
                                            <td>{{ formation.nom }}</td>
                                            <td>{{ formation.date | date:'dd/MM/yyyy' }}</td>
                                            <td>
                                                <p-tag [value]="formation.statut" [severity]="getStatusSeverity(formation.statut)"></p-tag>
                                            </td>
                                            <td>
                                                <div class="flex align-items-center">
                                                    <i class="pi pi-star-fill text-yellow-500 mr-1" *ngFor="let star of formation.note"></i>
                                                    <i class="pi pi-star text-yellow-500 mr-1" *ngFor="let star of [1,2,3,4,5].slice(formation.note)"></i>
                                                </div>
                                            </td>
                                        </tr>
                                    </ng-template>
                                </p-table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class EmployeeProfileComponent implements OnInit {
    
    user = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@entreprise.com',
        telephone: '+33 6 12 34 56 78',
        departement: 'Développement',
        poste: 'Développeur Full Stack',
        role: 'Employé'
    };
    
    stats = {
        totalFormations: 12,
        certifications: 8,
        heuresFormation: 156,
        noteMoyenne: 4.2
    };
    
    formationsRecentes = [
        {
            nom: 'Angular Avancé',
            date: new Date('2024-01-15'),
            statut: 'Terminé',
            note: 5
        },
        {
            nom: 'React Fundamentals',
            date: new Date('2023-12-20'),
            statut: 'Terminé',
            note: 4
        },
        {
            nom: 'CSS Grid & Flexbox',
            date: new Date('2023-11-15'),
            statut: 'Terminé',
            note: 5
        }
    ];

    ngOnInit() {
        // Charger les informations du profil
    }

    saveProfile() {
        // Sauvegarder les modifications du profil
        console.log('Saving profile:', this.user);
    }

    getStatusSeverity(statut: string): string {
        switch (statut) {
            case 'Terminé':
                return 'success';
            case 'En cours':
                return 'info';
            case 'En attente':
                return 'warning';
            default:
                return 'info';
        }
    }
} 