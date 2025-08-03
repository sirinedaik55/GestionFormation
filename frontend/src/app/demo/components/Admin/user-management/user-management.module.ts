import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';

// Routing
import { UserManagementRoutingModule } from './user-management-routing.module';

// Components
import { UserManagementComponent } from './user-management.component';

@NgModule({
    declarations: [
        UserManagementComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        UserManagementRoutingModule,
        
        // PrimeNG Modules
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        DropdownModule,
        BadgeModule,
        ToastModule,
        ConfirmDialogModule,
        TooltipModule,
        CardModule
    ]
})
export class UserManagementModule { }
