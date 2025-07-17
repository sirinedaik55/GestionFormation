import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiscussionService, Message, User } from '../../../../services/discussion.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './panelsdemo.component.html',
    providers: [MessageService]
})
export class PanelsDemoComponent implements OnInit, OnDestroy {

    messages: Message[] = [];
    users: User[] = [];
    newMessage: string = '';
    selectedUser: User | null = null;
    currentUser = { id: 1, name: 'Current User', role: 'admin' as const };

    private messagesSubscription?: Subscription;
    private usersSubscription?: Subscription;

    constructor(
        private discussionService: DiscussionService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadMessages();
        this.loadUsers();
    }

    ngOnDestroy() {
        this.messagesSubscription?.unsubscribe();
        this.usersSubscription?.unsubscribe();
    }

    loadMessages() {
        this.messagesSubscription = this.discussionService.getMessages().subscribe(
            messages => {
                this.messages = messages.sort((a, b) =>
                    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );
            }
        );
    }

    loadUsers() {
        this.usersSubscription = this.discussionService.getUsers().subscribe(
            users => {
                this.users = users.filter(user => user.id !== this.currentUser.id);
            }
        );
    }

    sendMessage() {
        if (!this.newMessage.trim()) return;

        this.discussionService.sendMessage(
            this.newMessage,
            this.selectedUser?.id
        ).subscribe({
            next: () => {
                this.newMessage = '';
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Message sent successfully'
                });
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to send message'
                });
            }
        });
    }

    selectUser(user: User) {
        this.selectedUser = user;
    }

    clearSelection() {
        this.selectedUser = null;
    }

    deleteMessage(messageId: number) {
        this.discussionService.deleteMessage(messageId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Message deleted successfully'
                });
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete message'
                });
            }
        });
    }

    markAsRead(messageId: number) {
        this.discussionService.markAsRead(messageId).subscribe();
    }

    getRoleColor(role: string): string {
        switch (role) {
            case 'admin': return 'text-red-600';
            case 'trainer': return 'text-blue-600';
            case 'employee': return 'text-green-600';
            default: return 'text-gray-600';
        }
    }

    getRoleBadgeClass(role: string): string {
        switch (role) {
            case 'admin': return 'p-badge-danger';
            case 'trainer': return 'p-badge-info';
            case 'employee': return 'p-badge-success';
            default: return 'p-badge-secondary';
        }
    }

    getFilteredMessages(): Message[] {
        if (!this.selectedUser) {
            return this.messages;
        }
        return this.messages.filter(msg =>
            msg.senderId === this.selectedUser!.id ||
            msg.recipientId === this.selectedUser!.id ||
            msg.recipientId === this.currentUser.id ||
            msg.senderId === this.currentUser.id
        );
    }
}
