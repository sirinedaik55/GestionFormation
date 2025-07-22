import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-employee-documents',
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <h2 class="text-900 font-semibold mb-2">Formation Documents</h2>
                    <p class="text-600 mb-4">Access and download documents from your formations</p>

                    <div class="text-center py-5">
                        <i class="pi pi-file text-4xl text-primary mb-3"></i>
                        <h5 class="text-500">Documents Module Coming Soon</h5>
                        <p class="text-500 m-0">This feature will be implemented in the next phase.</p>
                    </div>
                </div>
            </div>
        </div>
        <p-toast></p-toast>
    `
})
export class EmployeeDocumentsComponent {}

@NgModule({
    declarations: [EmployeeDocumentsComponent],
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        ToastModule,
        RouterModule.forChild([
            { path: '', component: EmployeeDocumentsComponent }
        ])
    ]
})
export class EmployeeDocumentsModule { }
