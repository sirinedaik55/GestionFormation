import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

// Routing
import { TrainerDocumentsRoutingModule } from './trainer-documents-routing.module';

// Components
import { TrainerDocumentsComponent } from './trainer-documents.component';

@NgModule({
    declarations: [
        TrainerDocumentsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TrainerDocumentsRoutingModule,
        
        // PrimeNG Modules
        ButtonModule,
        CardModule,
        DialogModule,
        FileUploadModule,
        InputTextModule,
        InputTextareaModule,
        ProgressSpinnerModule,
        TableModule,
        TagModule,
        ToastModule,
        ToolbarModule
    ]
})
export class TrainerDocumentsModule { }
