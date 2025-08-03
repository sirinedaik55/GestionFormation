import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormationService, Formation } from '../../../services/formation.service';

@Component({
    selector: 'app-employee-dashboard',
    templateUrl: './employee-dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {
    upcomingFormations: Formation[] = [];
    completedFormations: Formation[] = [];
    totalFormations: number = 0;
    attendanceRate: number = 0;

    constructor(
        private formationService: FormationService,
        private router: Router
    ) {}

    async ngOnInit() {
        console.log('🔧 EmployeeDashboardComponent: Initializing...');
        await this.loadEmployeeData();
    }

    private async loadEmployeeData() {
        try {
            console.log('🔧 EmployeeDashboardComponent: Loading employee formations...');
            
            // Load all formations for now (in real app, would load employee-specific data)
            const allFormations = await this.formationService.getFormations().toPromise() || [];
            
            // Filter upcoming and completed formations
            const now = new Date();
            this.upcomingFormations = allFormations.filter(f => 
                new Date(f.date) > now && f.status !== 'cancelled'
            ).slice(0, 5); // Show only next 5
            
            this.completedFormations = allFormations.filter(f => 
                f.status === 'completed'
            ).slice(0, 5); // Show last 5
            
            this.totalFormations = allFormations.length;
            this.attendanceRate = 85; // Mock data - would come from API
            
            console.log('🔧 EmployeeDashboardComponent: Data loaded successfully');
        } catch (error) {
            console.error('🔧 EmployeeDashboardComponent: Error loading data:', error);
        }
    }

    // Navigation methods for employee actions
    navigateToMyFormations() {
        console.log('🔧 EmployeeDashboardComponent: Navigating to my formations...');
        this.router.navigate(['/dashboard/employee/formations']);
    }

    navigateToFormationHistory() {
        console.log('🔧 EmployeeDashboardComponent: Navigating to formation history...');
        this.router.navigate(['/dashboard/employee/history']);
    }

    navigateToDocuments() {
        console.log('🔧 EmployeeDashboardComponent: Navigating to documents...');
        this.router.navigate(['/dashboard/employee/documents']);
    }

    viewFormationDetails(formation: Formation) {
        console.log('🔧 EmployeeDashboardComponent: Viewing formation details:', formation.id);
        this.router.navigate(['/employee/formations', formation.id]);
    }
}
