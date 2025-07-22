import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

// Routing
import { TrainerAttendanceRoutingModule } from './trainer-attendance-routing.module';

// Components
import { TrainerAttendanceComponent } from './trainer-attendance.component';
import { AttendanceHistoryComponent } from './history/attendance-history.component';

@NgModule({
    declarations: [
        TrainerAttendanceComponent,
        AttendanceHistoryComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TrainerAttendanceRoutingModule,
        
        // PrimeNG Modules
        ButtonModule,
        CardModule,
        CheckboxModule,
        DialogModule,
        DropdownModule,
        InputTextModule,
        PanelModule,
        ProgressSpinnerModule,
        ProgressBarModule,
        RadioButtonModule,
        RippleModule,
        TableModule,
        TagModule,
        ToastModule,
        ToolbarModule,
        TooltipModule,
        ConfirmDialogModule
    ]
})
export class TrainerAttendanceModule { }
