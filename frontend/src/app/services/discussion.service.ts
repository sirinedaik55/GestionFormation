import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Message {
    id: number;
    senderId: number;
    senderName: string;
    senderRole: 'admin' | 'employee' | 'trainer';
    content: string;
    timestamp: Date;
    isRead: boolean;
    recipientId?: number;
    recipientName?: string;
    recipientRole?: 'admin' | 'employee' | 'trainer';
}

export interface User {
    id: number;
    name: string;
    role: 'admin' | 'employee' | 'trainer';
    isOnline: boolean;
    lastSeen?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class DiscussionService {
    private apiUrl = 'http://localhost:8080/api';
    private messagesSubject = new BehaviorSubject<Message[]>([]);
    private usersSubject = new BehaviorSubject<User[]>([]);

    constructor(private http: HttpClient) {
        this.loadInitialData();
    }

    private loadInitialData() {
        // Mock data for demonstration
        const mockMessages: Message[] = [
            {
                id: 1,
                senderId: 1,
                senderName: 'Admin System',
                senderRole: 'admin',
                content: 'Welcome to the discussion panel! This is where you can communicate with all team members.',
                timestamp: new Date('2024-01-15T10:00:00'),
                isRead: true
            },
            {
                id: 2,
                senderId: 2,
                senderName: 'John Trainer',
                senderRole: 'trainer',
                content: 'Hello everyone! The new Angular training session is scheduled for next week.',
                timestamp: new Date('2024-01-15T11:30:00'),
                isRead: false
            },
            {
                id: 3,
                senderId: 3,
                senderName: 'Sarah Employee',
                senderRole: 'employee',
                content: 'Can someone help me with the training materials for the React course?',
                timestamp: new Date('2024-01-15T14:15:00'),
                isRead: false
            }
        ];

        const mockUsers: User[] = [
            { id: 1, name: 'Admin System', role: 'admin', isOnline: true },
            { id: 2, name: 'John Trainer', role: 'trainer', isOnline: true, lastSeen: new Date() },
            { id: 3, name: 'Sarah Employee', role: 'employee', isOnline: false, lastSeen: new Date('2024-01-15T13:00:00') },
            { id: 4, name: 'Mike Trainer', role: 'trainer', isOnline: true },
            { id: 5, name: 'Lisa Employee', role: 'employee', isOnline: false, lastSeen: new Date('2024-01-15T12:30:00') }
        ];

        this.messagesSubject.next(mockMessages);
        this.usersSubject.next(mockUsers);
    }

    getMessages(): Observable<Message[]> {
        return this.messagesSubject.asObservable();
    }

    getUsers(): Observable<User[]> {
        return this.usersSubject.asObservable();
    }

    sendMessage(content: string, recipientId?: number): Observable<Message> {
        // Mock current user (in real app, get from auth service)
        const currentUser = { id: 1, name: 'Current User', role: 'admin' as const };
        
        const newMessage: Message = {
            id: Date.now(),
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderRole: currentUser.role,
            content: content,
            timestamp: new Date(),
            isRead: false,
            recipientId: recipientId
        };

        const currentMessages = this.messagesSubject.value;
        this.messagesSubject.next([...currentMessages, newMessage]);

        // In real app, send to backend
        return new Observable(observer => {
            observer.next(newMessage);
            observer.complete();
        });
    }

    markAsRead(messageId: number): Observable<void> {
        const messages = this.messagesSubject.value;
        const updatedMessages = messages.map(msg => 
            msg.id === messageId ? { ...msg, isRead: true } : msg
        );
        this.messagesSubject.next(updatedMessages);

        return new Observable(observer => {
            observer.next();
            observer.complete();
        });
    }

    deleteMessage(messageId: number): Observable<void> {
        const messages = this.messagesSubject.value;
        const updatedMessages = messages.filter(msg => msg.id !== messageId);
        this.messagesSubject.next(updatedMessages);

        return new Observable(observer => {
            observer.next();
            observer.complete();
        });
    }

    // Real API methods (to be implemented when backend is ready)
    private getMessagesFromAPI(): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.apiUrl}/messages`);
    }

    private getUsersFromAPI(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/users`);
    }

    private sendMessageToAPI(message: Partial<Message>): Observable<Message> {
        return this.http.post<Message>(`${this.apiUrl}/messages`, message);
    }
}
