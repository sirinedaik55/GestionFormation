import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DividerModule } from 'primeng/divider';

// Routing
import { TrainerProfileRoutingModule } from './trainer-profile-routing.module';

// Components
import { TrainerProfileComponent } from './trainer-profile.component';

@NgModule({
    declarations: [
        TrainerProfileComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        TrainerProfileRoutingModule,
        
        // PrimeNG Modules
        ButtonModule,
        CardModule,
        InputTextModule,
        InputTextareaModule,
        PasswordModule,
        TabViewModule,
        ToastModule,
        DropdownModule,
        InputSwitchModule,
        DividerModule
    ]
})
export class TrainerProfileModule { }
