import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatisticsService, DashboardStats, MonthlyFormations } from '../../../services/statistics.service';
import { FormationService } from '../../../services/formation.service';
import { Subscription, lastValueFrom } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    chartData: any;
    chartOptions: any;
    subscription!: Subscription;

    // Statistics data
    dashboardStats: DashboardStats | null = null;
    monthlyFormations: MonthlyFormations[] = [];
    loading: boolean = true;
    loadingFormations: boolean = true;

    // Dashboard data
    recentFormations: any[] = [];
    recentActivities: any[] = [];

    constructor(
        private statisticsService: StatisticsService,
        private formationService: FormationService,
        public layoutService: LayoutService
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });
    }

    async ngOnInit() {
        this.initChart();
        // Load statistics data
        await this.loadDashboardData();
    }

    async loadDashboardData() {
        try {
            console.log('🔄 Loading dashboard data...');
            this.loading = true;

            // Load dashboard stats
            console.log('📊 Loading dashboard stats...');
            this.dashboardStats = await lastValueFrom(this.statisticsService.getDashboardStats());
            console.log('✅ Dashboard stats loaded:', this.dashboardStats);

            // Load monthly formations data
            console.log('📅 Loading monthly formations...');
            this.monthlyFormations = await lastValueFrom(this.statisticsService.getMonthlyFormations());
            console.log('✅ Monthly formations loaded:', this.monthlyFormations);

            // Load recent formations
            await this.loadRecentFormations();

            // Load recent activities
            this.loadRecentActivities();

            // Update chart with real data
            this.updateFormationsChart();

        } catch (error) {
            console.error('❌ Error loading dashboard data:', error);
        } finally {
            this.loading = false;
            console.log('✅ Dashboard loading complete');
        }
    }

    async loadRecentFormations() {
        try {
            this.loadingFormations = true;
            const formations = await lastValueFrom(this.formationService.getFormations());
            // Get the 5 most recent formations
            this.recentFormations = formations
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((formation: any) => ({
                    ...formation,
                    team: formation.team?.name || 'No team',
                    trainer: formation.trainer ?
                        `${formation.trainer.first_name} ${formation.trainer.last_name}` :
                        'No trainer',
                    status: this.getFormationStatus(formation)
                }));
        } catch (error) {
            console.error('Error loading recent formations:', error);
            this.recentFormations = [];
        } finally {
            this.loadingFormations = false;
        }
    }

    loadRecentActivities() {
        // Mock recent activities - in a real app, this would come from an API
        this.recentActivities = [
            {
                title: 'Formation Created',
                description: 'Web Development Training scheduled',
                time: '2 hours ago',
                icon: 'pi-plus-circle',
                color: '#10b981'
            },
            {
                title: 'Employee Registered',
                description: 'New team member added to Development team',
                time: '4 hours ago',
                icon: 'pi-user-plus',
                color: '#3b82f6'
            },
            {
                title: 'Training Completed',
                description: 'UI/UX Design Workshop finished',
                time: '1 day ago',
                icon: 'pi-check-circle',
                color: '#8b5cf6'
            },
            {
                title: 'Team Updated',
                description: 'Marketing team speciality changed',
                time: '2 days ago',
                icon: 'pi-users',
                color: '#f59e0b'
            }
        ];
    }

    getFormationStatus(formation: any): string {
        const now = new Date();
        const formationDate = new Date(formation.date);

        if (formation.status === 'cancelled') return 'cancelled';
        if (formation.status === 'completed') return 'completed';
        if (formationDate > now) return 'scheduled';
        return 'completed';
    }

    getCurrentDate(): string {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Formations',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Will be updated with real data
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    tension: .4
                },
                {
                    label: 'Attendance Rate (%)',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Will be updated with real data
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4,
                    yAxisID: 'y1'
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    ticks: {
                        color: textColorSecondary,
                        max: 100
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        };
    }

    updateFormationsChart() {
        if (!this.monthlyFormations.length) return;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formationsData = new Array(12).fill(0);
        const attendanceData = new Array(12).fill(0);

        this.monthlyFormations.forEach(item => {
            const monthIndex = new Date(item.month + ' 1, 2025').getMonth();
            formationsData[monthIndex] = item.count;
            attendanceData[monthIndex] = item.attendanceRate;
        });

        this.chartData = {
            ...this.chartData,
            datasets: [
                {
                    ...this.chartData.datasets[0],
                    data: formationsData
                },
                {
                    ...this.chartData.datasets[1],
                    data: attendanceData
                }
            ]
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
