import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormationService, Formation } from '../../../services/formation.service';

@Component({
    selector: 'app-trainer-dashboard',
    templateUrl: './trainer-dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class TrainerDashboardComponent implements OnInit {
    myFormations: Formation[] = [];
    upcomingFormations: Formation[] = [];
    completedFormations: Formation[] = [];
    totalStudents: number = 0;
    averageAttendance: number = 0;

    constructor(
        private formationService: FormationService,
        private router: Router
    ) {}

    async ngOnInit() {
        console.log('🔧 TrainerDashboardComponent: Initializing...');
        await this.loadTrainerData();
    }

    private async loadTrainerData() {
        try {
            console.log('🔧 TrainerDashboardComponent: Loading trainer formations...');
            
            // Load all formations for now (in real app, would load trainer-specific data)
            const allFormations = await this.formationService.getFormations().toPromise() || [];
            
            // Filter formations by trainer (mock logic)
            this.myFormations = allFormations.slice(0, 8); // Mock: first 8 formations
            
            // Filter upcoming and completed formations
            const now = new Date();
            this.upcomingFormations = this.myFormations.filter(f => 
                new Date(f.date) > now && f.status !== 'cancelled'
            );
            
            this.completedFormations = this.myFormations.filter(f => 
                f.status === 'completed'
            );
            
            this.totalStudents = 45; // Mock data
            this.averageAttendance = 88; // Mock data
            
            console.log('🔧 TrainerDashboardComponent: Data loaded successfully');
        } catch (error) {
            console.error('🔧 TrainerDashboardComponent: Error loading data:', error);
        }
    }

    // Navigation methods for trainer actions
    navigateToMyFormations() {
        console.log('🔧 TrainerDashboardComponent: Navigating to my formations...');
        this.router.navigate(['/dashboard/trainer/formations']);
    }

    navigateToAttendance() {
        console.log('🔧 TrainerDashboardComponent: Navigating to attendance...');
        this.router.navigate(['/dashboard/trainer/attendance']);
    }

    navigateToDocuments() {
        console.log('🔧 TrainerDashboardComponent: Navigating to documents...');
        this.router.navigate(['/dashboard/trainer/documents']);
    }

    navigateToReports() {
        console.log('🔧 TrainerDashboardComponent: Navigating to reports...');
        this.router.navigate(['/dashboard/trainer/reports']);
    }

    viewFormationDetails(formation: Formation) {
        console.log('🔧 TrainerDashboardComponent: Viewing formation details:', formation.id);
        this.router.navigate(['/trainer/formations', formation.id]);
    }

    markAttendance(formation: Formation) {
        console.log('🔧 TrainerDashboardComponent: Marking attendance for:', formation.id);
        this.router.navigate(['/trainer/formations', formation.id, 'attendance']);
    }
}
