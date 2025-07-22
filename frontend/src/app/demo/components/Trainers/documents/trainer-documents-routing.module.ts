import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { TrainerDocumentsComponent } from './trainer-documents.component';

const routes: Routes = [
    {
        path: '',
        component: TrainerDocumentsComponent,
        data: { breadcrumb: 'Documents' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrainerDocumentsRoutingModule { }
