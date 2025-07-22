import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { TrainerProfileComponent } from './trainer-profile.component';

const routes: Routes = [
    {
        path: '',
        component: TrainerProfileComponent,
        data: { breadcrumb: 'Profile' }
    },
    {
        path: 'settings',
        component: TrainerProfileComponent,
        data: { breadcrumb: 'Settings' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrainerProfileRoutingModule { }
