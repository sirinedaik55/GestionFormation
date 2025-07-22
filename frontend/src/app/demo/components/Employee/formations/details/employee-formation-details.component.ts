import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-employee-formation-details',
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <div class="flex justify-content-between align-items-center mb-4">
                        <h2 class="text-900 font-semibold m-0">Formation Details</h2>
                        <p-button 
                            label="Back to List" 
                            icon="pi pi-arrow-left" 
                            class="p-button-outlined"
                            (click)="goBack()">
                        </p-button>
                    </div>
                    
                    <div class="text-center py-5">
                        <i class="pi pi-cog pi-spin text-4xl text-primary mb-3"></i>
                        <h5 class="text-500">Formation Details Coming Soon</h5>
                        <p class="text-500 m-0">This feature will be implemented in the next phase.</p>
                    </div>
                </div>
            </div>
        </div>
        <p-toast></p-toast>
    `,
    providers: [MessageService]
})
export class EmployeeFormationDetailsComponent implements OnInit {
    
    formationId!: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.formationId = +this.route.snapshot.params['id'];
        console.log('Formation ID:', this.formationId);
    }

    goBack() {
        this.router.navigate(['/employee/formations']);
    }
}
