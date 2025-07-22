import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

interface FormationReport {
    id: number;
    formation: string;
    date: string;
    overallRating: number;
    objectives: string;
    difficulties: string;
    improvements: string;
    status: 'draft' | 'submitted';
}

@Component({
    selector: 'app-trainer-reports',
    templateUrl: './trainer-reports.component.html',
    providers: [MessageService]
})
export class TrainerReportsComponent implements OnInit {
    
    reports: FormationReport[] = [];
    loading: boolean = false;
    reportDialog: boolean = false;
    
    // Report form
    selectedFormation: string = '';
    overallRating: number = 0;
    objectives: string = '';
    difficulties: string = '';
    improvements: string = '';
    
    availableFormations = [
        'Angular Advanced Concepts',
        'TypeScript Best Practices',
        'React Fundamentals',
        'JavaScript ES6+'
    ];

    constructor(
        private messageService: MessageService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        console.log('TrainerReportsComponent ngOnInit called');
        this.loadReports();

        // Check if we should open create dialog automatically
        this.route.queryParams.subscribe(params => {
            if (params['action'] === 'create') {
                console.log('Auto-opening create report dialog from dashboard');
                setTimeout(() => {
                    this.showCreateDialog();
                }, 500); // Small delay to ensure component is fully loaded
            }
        });
    }

    loadReports() {
        this.loading = true;
        
        // Mock data
        setTimeout(() => {
            this.reports = [
                {
                    id: 1,
                    formation: 'React Fundamentals',
                    date: '2024-01-15',
                    overallRating: 4,
                    objectives: 'All objectives were met successfully. Participants showed good understanding of React concepts.',
                    difficulties: 'Some participants struggled with JSX syntax initially.',
                    improvements: 'Add more hands-on exercises for JSX practice.',
                    status: 'submitted'
                },
                {
                    id: 2,
                    formation: 'JavaScript ES6+',
                    date: '2024-01-10',
                    overallRating: 5,
                    objectives: 'Excellent session. All modern JavaScript features were covered comprehensively.',
                    difficulties: 'Arrow functions concept needed extra explanation.',
                    improvements: 'Include more real-world examples.',
                    status: 'submitted'
                }
            ];
            this.loading = false;
        }, 1000);
    }

    showCreateDialog() {
        console.log('showCreateDialog called - opening dialog');
        this.reportDialog = true;
        this.resetForm();
    }

    resetForm() {
        this.selectedFormation = '';
        this.overallRating = 0;
        this.objectives = '';
        this.difficulties = '';
        this.improvements = '';
    }

    saveReport() {
        console.log('saveReport called - staying on reports page');

        if (!this.selectedFormation || !this.objectives) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please fill in required fields',
                life: 3000
            });
            return;
        }

        const newReport: FormationReport = {
            id: this.reports.length + 1,
            formation: this.selectedFormation,
            date: new Date().toISOString().split('T')[0],
            overallRating: this.overallRating,
            objectives: this.objectives,
            difficulties: this.difficulties,
            improvements: this.improvements,
            status: 'submitted'
        };

        this.reports.unshift(newReport);
        this.reportDialog = false;

        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Formation report created successfully',
            life: 3000
        });

        console.log('Report saved successfully, staying on current page');
    }

    viewReport(report: FormationReport) {
        // Implementation for viewing full report
        this.messageService.add({
            severity: 'info',
            summary: 'View Report',
            detail: `Viewing report for ${report.formation}`,
            life: 2000
        });
    }

    downloadReport(report: FormationReport) {
        this.messageService.add({
            severity: 'info',
            summary: 'Download',
            detail: `Downloading report for ${report.formation}`,
            life: 2000
        });
    }

    getStatusSeverity(status: string): string {
        switch (status) {
            case 'submitted': return 'success';
            case 'draft': return 'warning';
            default: return 'info';
        }
    }
}
