import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { TrainerFormationsListComponent } from './list/trainer-formations-list.component';
import { TrainerFormationDetailsComponent } from './details/trainer-formation-details.component';
import { TrainerFormationCalendarComponent } from './calendar/trainer-formation-calendar.component';

const routes: Routes = [
    {
        path: '',
        component: TrainerFormationsListComponent,
        data: { breadcrumb: 'My Formations' }
    },
    {
        path: 'list',
        component: TrainerFormationsListComponent,
        data: { breadcrumb: 'List' }
    },
    {
        path: 'calendar',
        component: TrainerFormationCalendarComponent,
        data: { breadcrumb: 'Calendar' }
    },
    {
        path: 'details/:id',
        component: TrainerFormationDetailsComponent,
        data: { breadcrumb: 'Formation Details' }
    },
    {
        path: 'participants/:id',
        component: TrainerFormationDetailsComponent, // Réutilise le même composant pour l'instant
        data: { breadcrumb: 'Manage Participants' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrainerFormationsRoutingModule { }
