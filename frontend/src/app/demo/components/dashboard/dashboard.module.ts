import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { TrainerDashboardComponent } from './trainer-dashboard.component';
import { EmployeeDashboardComponent } from './employee-dashboard.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { StatisticsService } from '../../../services/statistics.service';
import { RoleService } from '../../../services/role.service';
import { HttpClientModule } from '@angular/common/http';

// Shared module for translations
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        TagModule,
        TooltipModule,
        DashboardsRoutingModule,
        HttpClientModule,
        SharedModule
    ],
    declarations: [
        DashboardComponent,
        AdminDashboardComponent,
        TrainerDashboardComponent,
        EmployeeDashboardComponent
    ],
    providers: [StatisticsService, RoleService]
})
export class DashboardModule { }
