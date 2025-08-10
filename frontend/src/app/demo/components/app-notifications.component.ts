// src/app/components/app-notifications.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, BadgeModule],
  template: `
    <div class="notifications">
      <i class="pi pi-bell p-mr-2"></i>
      <span class="p-badge p-badge-info">0</span>
    </div>
  `,
  styles: [
    `
      .notifications {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
      }
    `
  ]
})
export class AppNotificationsComponent {}