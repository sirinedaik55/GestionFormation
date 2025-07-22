import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

// Routing
import { EmployeeRoutingModule } from './employee-routing.module';

// Components
import { EmployeeDashboardComponent } from './dashboard/employee-dashboard.component';

@NgModule({
    declarations: [
        EmployeeDashboardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        EmployeeRoutingModule,
        
        // PrimeNG Modules
        ButtonModule,
        CardModule,
        ChartModule,
        DropdownModule,
        InputTextModule,
        ProgressBarModule,
        ProgressSpinnerModule,
        RippleModule,
        TableModule,
        TagModule,
        ToastModule,
        TooltipModule
    ]
})
export class EmployeeModule { }
