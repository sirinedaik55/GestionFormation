import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            { path: '', component: ProfileComponent }
        ]),
        ButtonModule,
        InputTextModule,
        CardModule,
        TagModule,
        ToastModule,
        ProgressSpinnerModule
    ],
    declarations: [ProfileComponent]
})
export class ProfileModule { }
