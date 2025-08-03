import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { SliderModule } from 'primeng/slider';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';

// Routing
import { TrainerRoutingModule } from './trainer-routing.module';

// Shared module for translations
import { SharedModule } from '../../../shared/shared.module';

// Components
import { TrainerDashboardComponent } from './dashboard/trainer-dashboard.component';

@NgModule({
    declarations: [
        TrainerDashboardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TrainerRoutingModule,
        
        // PrimeNG Modules
        ButtonModule,
        CardModule,
        ChartModule,
        DialogModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        MenuModule,
        PanelModule,
        ProgressBarModule,
        RippleModule,
        TableModule,
        TabViewModule,
        ToastModule,
        ToolbarModule,
        TooltipModule,
        CalendarModule,
        CheckboxModule,
        FileUploadModule,
        InputSwitchModule,
        RadioButtonModule,
        RatingModule,
        SliderModule,
        SkeletonModule,
        ProgressSpinnerModule,
        TagModule,
        SharedModule
    ]
})
export class TrainerModule { }
