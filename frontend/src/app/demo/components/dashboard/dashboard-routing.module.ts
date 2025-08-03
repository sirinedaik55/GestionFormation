import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent },
        {
            path: 'users',
            loadChildren: () => import('../Admin/user-management/user-management.module').then(m => m.UserManagementModule)
        }
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
