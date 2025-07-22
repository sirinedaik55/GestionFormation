import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Routing
import { TrainerFormationsRoutingModule } from './trainer-formations-routing.module';

// Components
import { TrainerFormationsListComponent } from './list/trainer-formations-list.component';
import { TrainerFormationDetailsComponent } from './details/trainer-formation-details.component';
import { TrainerFormationCalendarComponent } from './calendar/trainer-formation-calendar.component';

@NgModule({
    declarations: [
        TrainerFormationsListComponent,
        TrainerFormationDetailsComponent,
        TrainerFormationCalendarComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TrainerFormationsRoutingModule,
        
        // PrimeNG Modules
        ButtonModule,
        CardModule,
        CalendarModule,
        DialogModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        PanelModule,
        ProgressBarModule,
        RippleModule,
        TableModule,
        TabViewModule,
        TagModule,
        ToastModule,
        ToolbarModule,
        TooltipModule,
        SkeletonModule,
        ProgressSpinnerModule
    ]
})
export class TrainerFormationsModule { }
