import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, lastValueFrom } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { StatisticsService, FormationStats, TeamStats, EmployeeAttendance, DashboardStats, MonthlyFormations } from '../../../../services/statistics.service';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './charts.component.html',
    providers: [MessageService]
})
export class ChartsComponent implements OnInit, OnDestroy {

    // Data
    formationStats: FormationStats[] = [];
    teamStats: TeamStats[] = [];
    employeeStats: EmployeeAttendance[] = [];
    dashboardStats: DashboardStats | null = null;
    monthlyFormations: MonthlyFormations[] = [];

    // Loading states
    loadingFormations: boolean = false;
    loadingTeams: boolean = false;
    loadingEmployees: boolean = false;
    loading: boolean = true;

    // Filters
    startDate: string = '';
    endDate: string = '';
    selectedTab: number = 0;

    // Chart data properties
    barData: any;
    barOptions: any;
    pieData: any;
    pieOptions: any;
    lineData: any;
    lineOptions: any;
    polarData: any;
    polarOptions: any;
    radarData: any;
    radarOptions: any;
    
    // Additional chart data
    attendanceChartData: any;
    attendanceChartOptions: any;
    teamChartData: any;
    teamChartOptions: any;
    monthlyChartData: any;
    monthlyChartOptions: any;

    subscription!: Subscription;

    constructor(
        public layoutService: LayoutService,
        private statisticsService: StatisticsService,
        private messageService: MessageService
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initCharts();
        });
    }

    async ngOnInit() {
        this.initCharts();
        await this.loadStatistics();
    }

    async loadStatistics() {
        try {
            this.loading = true;
            
            // Load dashboard stats
            this.dashboardStats = await lastValueFrom(this.statisticsService.getDashboardStats());
            
            // Load monthly formations
            this.monthlyFormations = await lastValueFrom(this.statisticsService.getMonthlyFormations());
            
            // Load formation stats
            this.formationStats = await lastValueFrom(this.statisticsService.getFormationStats());
            
            // Load team stats
            this.teamStats = await lastValueFrom(this.statisticsService.getTeamStats());
            
            // Load employee stats
            this.employeeStats = await lastValueFrom(this.statisticsService.getEmployeeAttendance(20));
            
            // Update charts with real data
            this.updateChartsWithRealData();
            
        } catch (error) {
            console.error('Error loading statistics:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load statistics',
                life: 3000
            });
        } finally {
            this.loading = false;
        }
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Bar Chart
        this.barData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Formations',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'Attendance Rate',
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        this.barOptions = {
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
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
            }
        };

        // Pie Chart
        this.pieData = {
            labels: ['Present', 'Absent', 'Pending'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--red-500'),
                        documentStyle.getPropertyValue('--yellow-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--red-400'),
                        documentStyle.getPropertyValue('--yellow-400')
                    ]
                }]
        };

        this.pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };

        // Line Chart
        this.lineData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Formations Count',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    tension: .4
                },
                {
                    label: 'Attendance Rate',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.lineOptions = {
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
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        // Polar Area Chart
        this.polarData = {
            datasets: [{
                data: [11, 16, 7, 3],
                backgroundColor: [
                    documentStyle.getPropertyValue('--red-500'),
                    documentStyle.getPropertyValue('--blue-500'),
                    documentStyle.getPropertyValue('--yellow-500'),
                    documentStyle.getPropertyValue('--green-500')
                ],
                label: 'Team Performance'
            }],
            labels: ['Team A', 'Team B', 'Team C', 'Team D']
        };

        this.polarOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        // Radar Chart
        this.radarData = {
            labels: ['Attendance', 'Participation', 'Completion', 'Feedback', 'Performance', 'Engagement', 'Results'],
            datasets: [
                {
                    label: 'Current Period',
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    pointBorderColor: documentStyle.getPropertyValue('--primary-500'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--primary-500'),
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: 'Previous Period',
                    borderColor: documentStyle.getPropertyValue('--bluegray-500'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--bluegray-500'),
                    pointBorderColor: documentStyle.getPropertyValue('--bluegray-500'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--bluegray-500'),
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        };

        this.radarOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: textColorSecondary
                    }
                }
            }
        };
    }

    updateChartsWithRealData() {
        if (this.monthlyFormations.length > 0) {
            const months = this.monthlyFormations.map(f => f.month);
            const formationCounts = this.monthlyFormations.map(f => f.count);
            const attendanceRates = this.monthlyFormations.map(f => f.attendanceRate);

            // Update line chart with real data
            this.lineData = {
                ...this.lineData,
                labels: months,
                datasets: [
                    {
                        ...this.lineData.datasets[0],
                        data: formationCounts
                    },
                    {
                        ...this.lineData.datasets[1],
                        data: attendanceRates
                    }
                ]
            };

            // Update bar chart with real data
            this.barData = {
                ...this.barData,
                labels: months,
                datasets: [
                    {
                        ...this.barData.datasets[0],
                        data: formationCounts
                    },
                    {
                        ...this.barData.datasets[1],
                        data: attendanceRates
                    }
                ]
            };
        }

        if (this.teamStats.length > 0) {
            const teamNames = this.teamStats.map(t => t.name);
            const teamAttendance = this.teamStats.map(t => t.attendanceRate);

            // Update polar chart with team data
            this.polarData = {
                ...this.polarData,
                labels: teamNames,
                datasets: [{
                    ...this.polarData.datasets[0],
                    data: teamAttendance
                }]
            };
        }
    }

    async exportToPDF(type: 'formations' | 'teams' | 'employees') {
        try {
            const blob = await lastValueFrom(this.statisticsService.exportToPDF(type));
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${type}-statistics.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
            
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'PDF exported successfully',
                life: 3000
            });
        } catch (error) {
            console.error('Error exporting PDF:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to export PDF',
                life: 3000
            });
        }
    }

    async exportToCSV(type: 'formations' | 'teams' | 'employees') {
        try {
            const blob = await lastValueFrom(this.statisticsService.exportToCSV(type));
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${type}-statistics.csv`;
            link.click();
            window.URL.revokeObjectURL(url);
            
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'CSV exported successfully',
                life: 3000
            });
        } catch (error) {
            console.error('Error exporting CSV:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to export CSV',
                life: 3000
            });
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}


