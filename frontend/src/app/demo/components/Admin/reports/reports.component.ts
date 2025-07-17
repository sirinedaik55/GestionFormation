import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { ReportsService, ReportFilter, AttendanceReport, FormationReport, TeamReport } from '../../../../services/reports.service';
import { TeamService } from '../../../../services/team.service';
import { UserService } from '../../../service/user.service';
import { FormationService } from '../../../../services/formation.service';
import { Team } from '../../../../models/team.model';
import { User } from '../../../../models/user.model';
import { Formation } from '../../../../models/formation.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [MessageService]
})
export class ReportsComponent implements OnInit {

  // Data
  attendanceReports: AttendanceReport[] = [];
  formationReports: FormationReport[] = [];
  teamReports: TeamReport[] = [];

  // Filter options
  teams: Team[] = [];
  trainers: User[] = [];
  formations: Formation[] = [];

  // Loading states
  loadingAttendance: boolean = false;
  loadingFormations: boolean = false;
  loadingTeams: boolean = false;

  // Filters
  filters: ReportFilter = {};
  selectedTab: number = 0;

  // Date range
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(
    private reportsService: ReportsService,
    private teamService: TeamService,
    private userService: UserService,
    private formationService: FormationService,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    await this.loadFilterOptions();
    await this.loadAllReports();
  }

  async loadFilterOptions() {
    try {
      // Load teams
      this.teams = await lastValueFrom(this.teamService.getTeams());

      // Load trainers
      const trainersData = await this.userService.getUsersByRole('formateur');
      this.trainers = trainersData.map(trainer => ({
        ...trainer,
        name: `${trainer.first_name} ${trainer.last_name}`
      }));

      // Load formations
      this.formations = await this.formationService.getFormations();

    } catch (error) {
      console.error('Error loading filter options:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load filter options',
        life: 3000
      });
    }
  }

  async loadAllReports() {
    await Promise.all([
      this.loadAttendanceReport(),
      this.loadFormationReport(),
      this.loadTeamReport()
    ]);
  }

  async loadAttendanceReport() {
    this.loadingAttendance = true;
    try {
      this.attendanceReports = await lastValueFrom(this.reportsService.getAttendanceReport(this.filters));
    } catch (error) {
      console.error('Error loading attendance report:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load attendance report',
        life: 3000
      });
    } finally {
      this.loadingAttendance = false;
    }
  }

  async loadFormationReport() {
    this.loadingFormations = true;
    try {
      this.formationReports = await lastValueFrom(this.reportsService.getFormationReport(this.filters));
    } catch (error) {
      console.error('Error loading formation report:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load formation report',
        life: 3000
      });
    } finally {
      this.loadingFormations = false;
    }
  }

  async loadTeamReport() {
    this.loadingTeams = true;
    try {
      this.teamReports = await lastValueFrom(this.reportsService.getTeamReport(this.filters));
    } catch (error) {
      console.error('Error loading team report:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load team report',
        life: 3000
      });
    } finally {
      this.loadingTeams = false;
    }
  }

  applyFilters() {
    // Update filters object
    this.filters = {
      startDate: this.startDate ? this.startDate.toISOString().split('T')[0] : undefined,
      endDate: this.endDate ? this.endDate.toISOString().split('T')[0] : undefined,
      teamId: this.filters.teamId,
      trainerId: this.filters.trainerId,
      formationId: this.filters.formationId,
      status: this.filters.status
    };

    // Reload reports with new filters
    this.loadAllReports();
  }

  clearFilters() {
    this.filters = {};
    this.startDate = null;
    this.endDate = null;
    this.loadAllReports();
  }

  // Export methods
  async exportAttendancePDF() {
    try {
      const blob = await lastValueFrom(this.reportsService.exportAttendancePDF(this.filters));
      this.downloadFile(blob, 'attendance-report.pdf');
      this.showSuccessMessage('PDF exported successfully');
    } catch (error) {
      this.showErrorMessage('Failed to export PDF');
    }
  }

  async exportFormationPDF() {
    try {
      const blob = await lastValueFrom(this.reportsService.exportFormationPDF(this.filters));
      this.downloadFile(blob, 'formation-report.pdf');
      this.showSuccessMessage('PDF exported successfully');
    } catch (error) {
      this.showErrorMessage('Failed to export PDF');
    }
  }

  async exportTeamPDF() {
    try {
      const blob = await lastValueFrom(this.reportsService.exportTeamPDF(this.filters));
      this.downloadFile(blob, 'team-report.pdf');
      this.showSuccessMessage('PDF exported successfully');
    } catch (error) {
      this.showErrorMessage('Failed to export PDF');
    }
  }

  async exportAttendanceCSV() {
    try {
      const blob = await lastValueFrom(this.reportsService.exportAttendanceCSV(this.filters));
      this.downloadFile(blob, 'attendance-report.csv');
      this.showSuccessMessage('CSV exported successfully');
    } catch (error) {
      this.showErrorMessage('Failed to export CSV');
    }
  }

  async exportFormationCSV() {
    try {
      const blob = await lastValueFrom(this.reportsService.exportFormationCSV(this.filters));
      this.downloadFile(blob, 'formation-report.csv');
      this.showSuccessMessage('CSV exported successfully');
    } catch (error) {
      this.showErrorMessage('Failed to export CSV');
    }
  }

  async exportTeamCSV() {
    try {
      const blob = await lastValueFrom(this.reportsService.exportTeamCSV(this.filters));
      this.downloadFile(blob, 'team-report.csv');
      this.showSuccessMessage('CSV exported successfully');
    } catch (error) {
      this.showErrorMessage('Failed to export CSV');
    }
  }

  private downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private showSuccessMessage(detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail,
      life: 3000
    });
  }

  private showErrorMessage(detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail,
      life: 3000
    });
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'danger';
      case 'pending': return 'warning';
      default: return 'info';
    }
  }

  getFormationStatusSeverity(status: string): string {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'info';
      case 'cancelled': return 'danger';
      case 'pending': return 'warning';
      default: return 'info';
    }
  }
}
