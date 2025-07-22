import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { TrainerDashboardComponent } from './dashboard/trainer-dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: TrainerDashboardComponent,
        data: { breadcrumb: 'Dashboard' }
    },
    {
        path: 'dashboard',
        component: TrainerDashboardComponent,
        data: { breadcrumb: 'Dashboard' }
    },
    {
        path: 'formations',
        loadChildren: () => import('./formations/trainer-formations.module').then(m => m.TrainerFormationsModule),
        data: { breadcrumb: 'My Formations' }
    },
    {
        path: 'attendance',
        loadChildren: () => import('./attendance/trainer-attendance.module').then(m => m.TrainerAttendanceModule),
        data: { breadcrumb: 'Attendance' }
    },
    {
        path: 'documents',
        loadChildren: () => import('./documents/trainer-documents.module').then(m => m.TrainerDocumentsModule),
        data: { breadcrumb: 'Documents' }
    },
    {
        path: 'reports',
        loadChildren: () => import('./reports/trainer-reports.module').then(m => m.TrainerReportsModule),
        data: { breadcrumb: 'Reports' }
    },
    {
        path: 'profile',
        loadChildren: () => import('./profile/trainer-profile.module').then(m => m.TrainerProfileModule),
        data: { breadcrumb: 'Profile' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrainerRoutingModule { }
