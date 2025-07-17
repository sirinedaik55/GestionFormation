import { Component, OnInit } from '@angular/core';
import { StatisticsService, FormationStats, TeamStats, EmployeeAttendance } from '../../../../services/statistics.service';
import { lastValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './statistics.component.html',
    providers: [MessageService]
})
export class StatisticsComponent implements OnInit {
    
    // Data
    formationStats: FormationStats[] = [];
    teamStats: TeamStats[] = [];
    employeeStats: EmployeeAttendance[] = [];
    
    // Loading states
    loadingFormations: boolean = false;
    loadingTeams: boolean = false;
    loadingEmployees: boolean = false;
    
    // Filters
    startDate: string = '';
    endDate: string = '';
    selectedTab: number = 0;
    
    // Chart data
    attendanceChartData: any;
    attendanceChartOptions: any;
    
    constructor(
        private statisticsService: StatisticsService,
        private messageService: MessageService
    ) {
        this.initChartOptions();
    }

    async ngOnInit() {
        await this.loadAllStatistics();
    }

    async loadAllStatistics() {
        await Promise.all([
            this.loadFormationStats(),
            this.loadTeamStats(),
            this.loadEmployeeStats()
        ]);
    }

    async loadFormationStats() {
        try {
            this.loadingFormations = true;
            this.formationStats = await lastValueFrom(
                this.statisticsService.getFormationStats(this.startDate, this.endDate)
            );
            this.updateAttendanceChart();
        } catch (error) {
            console.error('Error loading formation stats:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load formation statistics',
                life: 3000
            });
        } finally {
            this.loadingFormations = false;
        }
    }

    async loadTeamStats() {
        try {
            this.loadingTeams = true;
            this.teamStats = await lastValueFrom(this.statisticsService.getTeamStats());
        } catch (error) {
            console.error('Error loading team stats:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load team statistics',
                life: 3000
            });
        } finally {
            this.loadingTeams = false;
        }
    }

    async loadEmployeeStats() {
        try {
            this.loadingEmployees = true;
            this.employeeStats = await lastValueFrom(
                this.statisticsService.getEmployeeAttendance(20)
            );
        } catch (error) {
            console.error('Error loading employee stats:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load employee statistics',
                life: 3000
            });
        } finally {
            this.loadingEmployees = false;
        }
    }

    async applyDateFilter() {
        if (this.startDate && this.endDate) {
            await this.loadFormationStats();
        }
    }

    clearDateFilter() {
        this.startDate = '';
        this.endDate = '';
        this.loadFormationStats();
    }

    initChartOptions() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.attendanceChartOptions = {
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
    }

    updateAttendanceChart() {
        if (!this.formationStats.length) return;

        const documentStyle = getComputedStyle(document.documentElement);
        
        this.attendanceChartData = {
            labels: this.formationStats.map(f => f.name),
            datasets: [
                {
                    label: 'Attendance Rate (%)',
                    data: this.formationStats.map(f => f.attendanceRate),
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    borderWidth: 1
                }
            ]
        };
    }

    async exportToPDF(type: 'formations' | 'teams' | 'employees') {
        try {
            const blob = await lastValueFrom(
                this.statisticsService.exportToPDF(type, {
                    startDate: this.startDate,
                    endDate: this.endDate
                })
            );
            
            const url = window.URL.createObjectURL(blob);
            const link = window.document.createElement('a');
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
            const blob = await lastValueFrom(
                this.statisticsService.exportToCSV(type, {
                    startDate: this.startDate,
                    endDate: this.endDate
                })
            );
            
            const url = window.URL.createObjectURL(blob);
            const link = window.document.createElement('a');
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

    getAttendanceClass(rate: number): string {
        if (rate >= 80) return 'text-green-500';
        if (rate >= 60) return 'text-yellow-500';
        return 'text-red-500';
    }
}
