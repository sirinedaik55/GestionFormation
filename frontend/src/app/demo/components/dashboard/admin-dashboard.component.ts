import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatisticsService, DashboardStats, MonthlyFormations } from '../../../services/statistics.service';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
    dashboardStats: DashboardStats = {
        totalFormations: 0,
        totalEmployees: 0,
        totalTeams: 0,
        totalTrainers: 0,
        globalAttendanceRate: 0,
        upcomingFormations: 0,
        completedFormations: 0,
        cancelledFormations: 0
    };

    monthlyData: MonthlyFormations[] = [];
    chartData: any;
    chartOptions: any;

    constructor(
        private statisticsService: StatisticsService,
        private router: Router
    ) {}

    async ngOnInit() {
        console.log('🔧 AdminDashboardComponent: Initializing...');
        await this.loadDashboardData();
        this.initChart();
    }

    private async loadDashboardData() {
        try {
            console.log('🔧 AdminDashboardComponent: Loading dashboard stats...');
            this.dashboardStats = await this.statisticsService.getDashboardStats().toPromise() || this.dashboardStats;
            
            console.log('🔧 AdminDashboardComponent: Loading monthly data...');
            this.monthlyData = await this.statisticsService.getMonthlyFormations().toPromise() || [];
            
            console.log('🔧 AdminDashboardComponent: Data loaded successfully');
        } catch (error) {
            console.error('🔧 AdminDashboardComponent: Error loading data:', error);
        }
    }

    private initChart() {
        this.chartData = {
            labels: this.monthlyData.map(item => item.month),
            datasets: [
                {
                    label: 'Formations',
                    data: this.monthlyData.map(item => item.count),
                    fill: false,
                    backgroundColor: '#2f4860',
                    borderColor: '#2f4860',
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
    }

    // Navigation methods for admin actions
    navigateToNewFormation() {
        console.log('🔧 AdminDashboardComponent: Navigating to new formation...');
        this.router.navigate(['/dashboard/uikit/formlayout']);
    }

    navigateToManageUsers() {
        console.log('🔧 AdminDashboardComponent: Navigating to manage users...');
        this.router.navigate(['/dashboard/uikit/crud/employees']);
    }

    navigateToStatistics() {
        console.log('🔧 AdminDashboardComponent: Navigating to statistics...');
        this.router.navigate(['/dashboard/uikit/statistics']);
    }

    navigateToManageTeams() {
        console.log('🔧 AdminDashboardComponent: Navigating to manage teams...');
        this.router.navigate(['/dashboard/uikit/crud/teams']);
    }
}
