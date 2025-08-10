import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NotificationService, Notification } from '../../../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-notifications',
    template: `
        <div class="notifications-container">
            <!-- Badge de notifications -->
            <div class="notification-badge" (click)="toggleNotifications()">
                <i class="pi pi-bell"></i>
                <span *ngIf="unreadCount > 0" class="notification-count">{{ unreadCount }}</span>
            </div>

            <!-- Panneau des notifications -->
            <div class="notifications-panel" *ngIf="showNotifications">
                <div class="notifications-header">
                    <h6>Notifications</h6>
                    <div class="notifications-actions">
                        <button 
                            pButton 
                            type="button" 
                            icon="pi pi-check" 
                            class="p-button-text p-button-sm"
                            (click)="markAllAsRead()"
                            [disabled]="unreadCount === 0">
                        </button>
                        <button 
                            pButton 
                            type="button" 
                            icon="pi pi-times" 
                            class="p-button-text p-button-sm"
                            (click)="toggleNotifications()">
                        </button>
                    </div>
                </div>

                <div class="notifications-list" *ngIf="notifications.length > 0; else emptyNotifications">
                    <div 
                        *ngFor="let notification of notifications" 
                        class="notification-item"
                        [class.unread]="!notification.read_at"
                        (click)="markAsRead(notification)">
                        
                        <div class="notification-icon">
                            <i [class]="getNotificationIcon(notification.type)"></i>
                        </div>
                        
                        <div class="notification-content">
                            <div class="notification-title">{{ notification.title }}</div>
                            <div class="notification-message">{{ notification.message }}</div>
                            <div class="notification-time">{{ formatDate(notification.created_at) }}</div>
                        </div>
                        
                        <div class="notification-actions">
                            <button 
                                pButton 
                                type="button" 
                                icon="pi pi-trash" 
                                class="p-button-text p-button-sm p-button-danger"
                                (click)="deleteNotification(notification, $event)">
                            </button>
                        </div>
                    </div>
                </div>

                <ng-template #emptyNotifications>
                    <div class="empty-notifications">
                        <i class="pi pi-bell text-400 text-2xl"></i>
                        <p>Aucune notification</p>
                    </div>
                </ng-template>

                <div class="notifications-footer" *ngIf="notifications.length > 0">
                    <button 
                        pButton 
                        type="button" 
                        label="Voir toutes" 
                        class="p-button-text p-button-sm"
                        (click)="viewAllNotifications()">
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .notifications-container {
            position: relative;
        }

        .notification-badge {
            position: relative;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: background-color 0.2s;
        }

        .notification-badge:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        .notification-count {
            position: absolute;
            top: 0;
            right: 0;
            background-color: #ef4444;
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        .notifications-panel {
            position: absolute;
            top: 100%;
            right: 0;
            width: 350px;
            max-height: 500px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            overflow: hidden;
        }

        .notifications-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border-bottom: 1px solid #e5e7eb;
            background-color: #f9fafb;
        }

        .notifications-header h6 {
            margin: 0;
            font-weight: 600;
        }

        .notifications-actions {
            display: flex;
            gap: 4px;
        }

        .notifications-list {
            max-height: 400px;
            overflow-y: auto;
        }

        .notification-item {
            display: flex;
            align-items: flex-start;
            padding: 12px 16px;
            border-bottom: 1px solid #f3f4f6;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .notification-item:hover {
            background-color: #f9fafb;
        }

        .notification-item.unread {
            background-color: #eff6ff;
        }

        .notification-icon {
            margin-right: 12px;
            margin-top: 2px;
        }

        .notification-content {
            flex: 1;
            min-width: 0;
        }

        .notification-title {
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 4px;
            color: #111827;
        }

        .notification-message {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 4px;
            line-height: 1.4;
        }

        .notification-time {
            font-size: 11px;
            color: #9ca3af;
        }

        .notification-actions {
            margin-left: 8px;
        }

        .empty-notifications {
            text-align: center;
            padding: 32px 16px;
            color: #6b7280;
        }

        .empty-notifications p {
            margin: 8px 0 0 0;
            font-size: 14px;
        }

        .notifications-footer {
            padding: 12px 16px;
            border-top: 1px solid #e5e7eb;
            background-color: #f9fafb;
            text-align: center;
        }
    `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
    notifications: Notification[] = [];
    unreadCount = 0;
    showNotifications = false;
    private subscription = new Subscription();

    constructor(
        private notificationService: NotificationService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        // S'abonner au compteur de notifications non lues
        this.subscription.add(
            this.notificationService.unreadCount$.subscribe(count => {
                this.unreadCount = count;
            })
        );

        // Charger les notifications
        this.loadNotifications();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    loadNotifications() {
        this.notificationService.getNotifications({ unread_only: true }).subscribe({
            next: (response) => {
                this.notifications = response.data;
            },
            error: (error) => {
                console.error('Erreur lors du chargement des notifications:', error);
            }
        });
    }

    toggleNotifications() {
        this.showNotifications = !this.showNotifications;
        if (this.showNotifications) {
            this.loadNotifications();
        }
    }

    markAsRead(notification: Notification) {
        if (notification.read_at) return;

        this.notificationService.markAsRead(notification.id).subscribe({
            next: () => {
                notification.read_at = new Date().toISOString();
                this.unreadCount = Math.max(0, this.unreadCount - 1);
                this.notificationService.updateUnreadCount(this.unreadCount);
                
                // Si c'est une notification de présence, rediriger vers la liste des présences
                if (notification.type === 'attendance') {
                    this.router.navigate(['/dashboard/admin/attendance']);
                }
            },
            error: (error) => {
                console.error('Erreur lors du marquage comme lu:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de marquer la notification comme lue'
                });
            }
        });
    }

    markAllAsRead() {
        this.notificationService.markAllAsRead().subscribe({
            next: () => {
                this.notifications.forEach(n => n.read_at = new Date().toISOString());
                this.unreadCount = 0;
                this.notificationService.updateUnreadCount(0);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Toutes les notifications ont été marquées comme lues'
                });
            },
            error: (error) => {
                console.error('Erreur lors du marquage de toutes les notifications:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de marquer toutes les notifications comme lues'
                });
            }
        });
    }

    deleteNotification(notification: Notification, event: Event) {
        event.stopPropagation();
        
        this.notificationService.deleteNotification(notification.id).subscribe({
            next: () => {
                this.notifications = this.notifications.filter(n => n.id !== notification.id);
                if (!notification.read_at) {
                    this.unreadCount = Math.max(0, this.unreadCount - 1);
                    this.notificationService.updateUnreadCount(this.unreadCount);
                }
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Notification supprimée'
                });
            },
            error: (error) => {
                console.error('Erreur lors de la suppression:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de supprimer la notification'
                });
            }
        });
    }

    viewAllNotifications() {
        this.router.navigate(['/dashboard/admin/notifications']);
        this.showNotifications = false;
    }

    getNotificationIcon(type: string): string {
        return this.notificationService.getNotificationIcon(type);
    }

    formatDate(dateString: string): string {
        return this.notificationService.formatNotificationDate(dateString);
    }
} 