import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatisticsComponent } from './statistics.component';
import { StatisticsRoutingModule } from './statistics-routing.module';

// PrimeNG modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        StatisticsRoutingModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        CalendarModule,
        TabViewModule,
        ToastModule,
        ProgressBarModule,
        ChartModule,
        CardModule
    ],
    declarations: [StatisticsComponent]
})
export class StatisticsModule { }
