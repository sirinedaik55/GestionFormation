import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

// Routing
import { EmployeeFormationsRoutingModule } from './employee-formations-routing.module';

// Components
import { EmployeeFormationsListComponent } from './list/employee-formations-list.component';
import { EmployeeFormationDetailsComponent } from './details/employee-formation-details.component';

@NgModule({
    declarations: [
        EmployeeFormationsListComponent,
        EmployeeFormationDetailsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        EmployeeFormationsRoutingModule,
        
        // PrimeNG Modules
        ButtonModule,
        CardModule,
        DropdownModule,
        InputTextModule,
        ProgressSpinnerModule,
        TableModule,
        TagModule,
        ToastModule,
        TooltipModule
    ]
})
export class EmployeeFormationsModule { }
