import { Component } from '@angular/core';

@Component({
    selector: 'app-test',
    template: `
        <div style="padding: 20px;">
            <h1>Test Component</h1>
            <p>If you see this, the routing is working!</p>
            <button (click)="goToLogin()">Go to Login</button>
        </div>
    `
})
export class TestComponent {
    
    goToLogin() {
        window.location.href = '/#/auth/login';
    }
}
