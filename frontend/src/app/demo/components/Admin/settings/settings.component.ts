import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  adminEmail: string;
  defaultLanguage: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoBackup: boolean;
  backupFrequency: string;
  maintenanceMode: boolean;
  debugMode: boolean;
}

interface NotificationSettings {
  formationReminder: boolean;
  attendanceAlert: boolean;
  reportGeneration: boolean;
  systemUpdates: boolean;
  reminderDays: number;
  emailTemplate: string;
}

interface SecuritySettings {
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  twoFactorAuth: boolean;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class SettingsComponent implements OnInit {

  // Settings objects
  systemSettings: SystemSettings = {
    siteName: 'Formation Management System',
    siteDescription: 'Complete training management solution',
    adminEmail: 'admin@company.com',
    defaultLanguage: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    maxFileSize: 10,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    backupFrequency: 'daily',
    maintenanceMode: false,
    debugMode: false
  };

  notificationSettings: NotificationSettings = {
    formationReminder: true,
    attendanceAlert: true,
    reportGeneration: true,
    systemUpdates: true,
    reminderDays: 3,
    emailTemplate: 'default'
  };

  securitySettings: SecuritySettings = {
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorAuth: false
  };

  // Options
  languageOptions = [
    { label: 'Français', value: 'fr' },
    { label: 'English', value: 'en' },
    { label: 'العربية', value: 'ar' }
  ];

  timezoneOptions = [
    { label: 'Europe/Paris', value: 'Europe/Paris' },
    { label: 'UTC', value: 'UTC' },
    { label: 'America/New_York', value: 'America/New_York' }
  ];

  dateFormatOptions = [
    { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
    { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
    { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }
  ];

  timeFormatOptions = [
    { label: '24 Hours', value: '24h' },
    { label: '12 Hours (AM/PM)', value: '12h' }
  ];

  backupFrequencyOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' }
  ];

  emailTemplateOptions = [
    { label: 'Default Template', value: 'default' },
    { label: 'Professional Template', value: 'professional' },
    { label: 'Modern Template', value: 'modern' }
  ];

  // Loading states
  savingSystem: boolean = false;
  savingNotifications: boolean = false;
  savingSecurity: boolean = false;

  // Active tab
  activeTab: number = 0;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings() {
    // In a real application, load settings from backend
    // For now, we use default values
    console.log('Settings loaded');
  }

  async saveSystemSettings() {
    this.savingSystem = true;
    try {
      // In a real application, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'System settings saved successfully',
        life: 3000
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save system settings',
        life: 3000
      });
    } finally {
      this.savingSystem = false;
    }
  }

  async saveNotificationSettings() {
    this.savingNotifications = true;
    try {
      // In a real application, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Notification settings saved successfully',
        life: 3000
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save notification settings',
        life: 3000
      });
    } finally {
      this.savingNotifications = false;
    }
  }

  async saveSecuritySettings() {
    this.savingSecurity = true;
    try {
      // In a real application, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Security settings saved successfully',
        life: 3000
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save security settings',
        life: 3000
      });
    } finally {
      this.savingSecurity = false;
    }
  }

  resetSystemSettings() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reset system settings to default values?',
      header: 'Confirm Reset',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Reset to default values
        this.systemSettings = {
          siteName: 'Formation Management System',
          siteDescription: 'Complete training management solution',
          adminEmail: 'admin@company.com',
          defaultLanguage: 'fr',
          timezone: 'Europe/Paris',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          maxFileSize: 10,
          allowedFileTypes: ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
          emailNotifications: true,
          smsNotifications: false,
          autoBackup: true,
          backupFrequency: 'daily',
          maintenanceMode: false,
          debugMode: false
        };

        this.messageService.add({
          severity: 'info',
          summary: 'Reset',
          detail: 'System settings reset to default values',
          life: 3000
        });
      }
    });
  }

  testEmailNotification() {
    this.messageService.add({
      severity: 'info',
      summary: 'Test Email',
      detail: 'Test email notification sent',
      life: 3000
    });
  }

  performBackup() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to perform a manual backup?',
      header: 'Confirm Backup',
      icon: 'pi pi-question-circle',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Backup',
          detail: 'Manual backup initiated successfully',
          life: 3000
        });
      }
    });
  }

  clearCache() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to clear the system cache?',
      header: 'Confirm Cache Clear',
      icon: 'pi pi-question-circle',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cache',
          detail: 'System cache cleared successfully',
          life: 3000
        });
      }
    });
  }

  exportSettings() {
    const settings = {
      system: this.systemSettings,
      notifications: this.notificationSettings,
      security: this.securitySettings
    };

    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = 'system-settings.json';
    link.click();
    window.URL.revokeObjectURL(url);

    this.messageService.add({
      severity: 'success',
      summary: 'Export',
      detail: 'Settings exported successfully',
      life: 3000
    });
  }
}
