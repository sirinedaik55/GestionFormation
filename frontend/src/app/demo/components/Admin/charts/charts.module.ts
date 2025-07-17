import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChartsComponent } from './charts.component';
import { ChartsRoutingModule } from './charts-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ChartsRoutingModule,
        ChartModule,
        ProgressSpinnerModule
    ],
    declarations: [ChartsComponent]
})
export class ChartsModule { }
