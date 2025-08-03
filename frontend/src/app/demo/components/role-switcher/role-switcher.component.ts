import { Component } from '@angular/core';
import { SimpleAuthService } from '../../../services/simple-auth.service';

@Component({
    selector: 'app-role-switcher',
    template: `
        <div class="card">
            <h5>Test Different User Roles</h5>
            <p class="text-600 mb-4">Switch between different user roles to test the application interfaces.</p>
            
            <div class="grid">
                <div class="col-12 md:col-4">
                    <div class="card border-1 border-blue-200 bg-blue-50">
                        <div class="text-center">
                            <i class="pi pi-user-plus text-blue-500 text-4xl mb-3"></i>
                            <h6 class="text-blue-900">Administrator</h6>
                            <p class="text-blue-700 text-sm mb-3">
                                Full access to all system features including user management, statistics, and reports.
                            </p>
                            <button pButton pRipple 
                                    label="Switch to Admin" 
                                    icon="pi pi-user-plus"
                                    class="p-button-info w-full"
                                    (click)="switchToAdmin()"></button>
                        </div>
                    </div>
                </div>
                
                <div class="col-12 md:col-4">
                    <div class="card border-1 border-green-200 bg-green-50">
                        <div class="text-center">
                            <i class="pi pi-user-edit text-green-500 text-4xl mb-3"></i>
                            <h6 class="text-green-900">Trainer</h6>
                            <p class="text-green-700 text-sm mb-3">
                                Manage formations, track attendance, and access training materials.
                            </p>
                            <button pButton pRipple 
                                    label="Switch to Trainer" 
                                    icon="pi pi-user-edit"
                                    class="p-button-success w-full"
                                    (click)="switchToTrainer()"></button>
                        </div>
                    </div>
                </div>
                
                <div class="col-12 md:col-4">
                    <div class="card border-1 border-orange-200 bg-orange-50">
                        <div class="text-center">
                            <i class="pi pi-user text-orange-500 text-4xl mb-3"></i>
                            <h6 class="text-orange-900">Employee</h6>
                            <p class="text-orange-700 text-sm mb-3">
                                View assigned formations, track progress, and access learning materials.
                            </p>
                            <button pButton pRipple 
                                    label="Switch to Employee" 
                                    icon="pi pi-user"
                                    class="p-button-warning w-full"
                                    (click)="switchToEmployee()"></button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-4 p-3 bg-yellow-50 border-1 border-yellow-200 border-round">
                <div class="flex align-items-center">
                    <i class="pi pi-info-circle text-yellow-600 mr-2"></i>
                    <span class="text-yellow-800 text-sm">
                        <strong>Note:</strong> This role switcher is for testing purposes only. 
                        In production, user roles are determined by authentication.
                    </span>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./role-switcher.component.scss']
})
export class RoleSwitcherComponent {
    
    constructor(private authService: SimpleAuthService) {}
    
    switchToAdmin() {
        this.authService.switchToAdmin();
    }
    
    switchToTrainer() {
        this.authService.switchToTrainer();
    }
    
    switchToEmployee() {
        this.authService.switchToEmployee();
    }
}
