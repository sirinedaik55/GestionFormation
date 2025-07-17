import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TeamsComponent } from './teams.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TeamsComponent }
    ])],
    exports: [RouterModule]
})
export class TeamsRoutingModule { }
