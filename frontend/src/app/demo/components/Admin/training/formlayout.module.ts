import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLayoutComponent } from './formlayout.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { FormlayoutRoutingModule } from './formlayout-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';


@NgModule({
    imports: [
        CommonModule,
        DropdownModule,
        FormsModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule,
        FormlayoutRoutingModule,
        TableModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        DialogModule
    ],
    declarations: [FormLayoutComponent]
})
export class FormlayoutModule { }
