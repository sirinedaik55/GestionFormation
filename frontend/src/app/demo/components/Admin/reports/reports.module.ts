import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';

// PrimeNG modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReportsRoutingModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        CalendarModule,
        TabViewModule,
        ToastModule,
        ProgressBarModule,
        TagModule,
        CardModule
    ],
    declarations: [ReportsComponent]
})
export class ReportsModule { }
