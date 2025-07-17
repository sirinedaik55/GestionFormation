import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';

// PrimeNG modules
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SettingsRoutingModule,
        TabViewModule,
        InputTextModule,
        InputTextareaModule,
        InputNumberModule,
        DropdownModule,
        CheckboxModule,
        ButtonModule,
        ToastModule,
        ConfirmDialogModule,
        CardModule
    ],
    declarations: [SettingsComponent]
})
export class SettingsModule { }
