import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

// Routing
import { TrainerReportsRoutingModule } from './trainer-reports-routing.module';

// Components
import { TrainerReportsComponent } from './trainer-reports.component';

@NgModule({
    declarations: [
        TrainerReportsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TrainerReportsRoutingModule,
        
        // PrimeNG Modules
        ButtonModule,
        CardModule,
        DialogModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        ProgressSpinnerModule,
        RatingModule,
        TableModule,
        TagModule,
        ToastModule
    ]
})
export class TrainerReportsModule { }
