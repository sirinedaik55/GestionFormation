import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'formlayout', loadChildren: () => import('../Admin/training/formlayout.module').then(m => m.FormlayoutModule) },
        { path: 'listtrain', loadChildren: () => import('../Admin/ListTrain/tabledemo.module').then(m => m.TableDemoModule) },

        { path: 'charts', loadChildren: () => import('../Admin/charts/charts.module').then(m => m.ChartsModule) },


        { path: 'input', loadChildren: () => import('./input/inputdemo.module').then(m => m.InputDemoModule) },
        
        { path: 'list', loadChildren: () => import('./list/listdemo.module').then(m => m.ListDemoModule) },
        
    
        { path: 'panel', loadChildren: () => import('./panels/panelsdemo.module').then(m => m.PanelsDemoModule) },
        { path: 'table', loadChildren: () => import('../Admin/ListTrain/tabledemo.module').then(m => m.TableDemoModule) },
        { path: 'tree', loadChildren: () => import('./tree/treedemo.module').then(m => m.TreeDemoModule) },
      
        { path: 'crud/employees', loadChildren: () => import('../Admin/crud/employees/employees.module').then(m => m.EmployeesModule) },
        { path: 'crud/trainers', loadChildren: () => import('../Admin/crud/trainers/trainers.module').then(m => m.TrainersModule) },
        { path: 'crud/teams', loadChildren: () => import('../Admin/crud/teams/teams.module').then(m => m.TeamsModule) },

        // New Admin Components
        { path: 'documents', loadChildren: () => import('../Admin/documents/documents.module').then(m => m.DocumentsModule) },
        { path: 'statistics', loadChildren: () => import('../Admin/statistics/statistics.module').then(m => m.StatisticsModule) },
        { path: 'reports', loadChildren: () => import('../Admin/reports/reports.module').then(m => m.ReportsModule) },
        { path: 'settings', loadChildren: () => import('../Admin/settings/settings.module').then(m => m.SettingsModule) },
        { path: 'profile', loadChildren: () => import('../Admin/profile/profile.module').then(m => m.ProfileModule) },
    ])],
    exports: [RouterModule]
})
export class UikitRoutingModule { }
