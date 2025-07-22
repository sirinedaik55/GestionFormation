import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { EmployeeFormationsListComponent } from './list/employee-formations-list.component';
import { EmployeeFormationDetailsComponent } from './details/employee-formation-details.component';

const routes: Routes = [
    {
        path: '',
        component: EmployeeFormationsListComponent,
        data: { breadcrumb: 'My Formations' }
    },
    {
        path: 'list',
        component: EmployeeFormationsListComponent,
        data: { breadcrumb: 'List' }
    },
    {
        path: 'details/:id',
        component: EmployeeFormationDetailsComponent,
        data: { breadcrumb: 'Details' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeFormationsRoutingModule { }
