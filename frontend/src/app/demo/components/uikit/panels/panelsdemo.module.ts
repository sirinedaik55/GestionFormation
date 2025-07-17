import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanelsDemoComponent } from './panelsdemo.component';
import { PanelsDemoRoutingModule } from './panelsdemo-routing.module';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PanelsDemoRoutingModule,
        ButtonModule,
        InputTextModule,
        ToastModule,
        BadgeModule,
        TooltipModule,
        HttpClientModule
    ],
    declarations: [PanelsDemoComponent]
})
export class PanelsDemoModule { }
