import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UnauthorizedComponent } from './unauthorized.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        RouterModule.forChild([
            { path: '', component: UnauthorizedComponent }
        ])
    ],
    declarations: [UnauthorizedComponent]
})
export class UnauthorizedModule { }
