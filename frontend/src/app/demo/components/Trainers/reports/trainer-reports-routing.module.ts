import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { TrainerReportsComponent } from './trainer-reports.component';

const routes: Routes = [
    {
        path: '',
        component: TrainerReportsComponent,
        data: { breadcrumb: 'Reports' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrainerReportsRoutingModule { }
