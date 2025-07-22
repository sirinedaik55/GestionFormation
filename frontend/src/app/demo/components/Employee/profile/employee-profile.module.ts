import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-employee-profile',
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <h2 class="text-900 font-semibold mb-2">My Profile</h2>
                    <p class="text-600 mb-4">Manage your profile information and settings</p>

                    <div class="text-center py-5">
                        <i class="pi pi-user text-4xl text-primary mb-3"></i>
                        <h5 class="text-500">Profile Module Coming Soon</h5>
                        <p class="text-500 m-0">This feature will be implemented in the next phase.</p>
                    </div>
                </div>
            </div>
        </div>
        <p-toast></p-toast>
    `
})
export class EmployeeProfileComponent {}

@NgModule({
    declarations: [EmployeeProfileComponent],
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        ToastModule,
        RouterModule.forChild([
            { path: '', component: EmployeeProfileComponent }
        ])
    ]
})
export class EmployeeProfileModule { }
