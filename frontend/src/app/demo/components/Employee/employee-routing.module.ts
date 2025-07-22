import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { EmployeeDashboardComponent } from './dashboard/employee-dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: EmployeeDashboardComponent,
        data: { breadcrumb: 'Dashboard' }
    },
    {
        path: 'dashboard',
        component: EmployeeDashboardComponent,
        data: { breadcrumb: 'Dashboard' }
    },
    {
        path: 'formations',
        loadChildren: () => import('./formations/employee-formations.module').then(m => m.EmployeeFormationsModule),
        data: { breadcrumb: 'My Formations' }
    },
    {
        path: 'history',
        loadChildren: () => import('./history/employee-history.module').then(m => m.EmployeeHistoryModule),
        data: { breadcrumb: 'Formation History' }
    },
    {
        path: 'documents',
        loadChildren: () => import('./documents/employee-documents.module').then(m => m.EmployeeDocumentsModule),
        data: { breadcrumb: 'Documents' }
    },
    {
        path: 'profile',
        loadChildren: () => import('./profile/employee-profile.module').then(m => m.EmployeeProfileModule),
        data: { breadcrumb: 'Profile' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }
