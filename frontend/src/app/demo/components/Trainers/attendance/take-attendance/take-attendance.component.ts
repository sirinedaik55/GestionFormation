import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AttendanceService, Attendance, FormationParticipant, AttendanceData } from '../../../../../services/attendance.service';

@Component({
  selector: 'app-take-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    ToastModule
  ],
  template: `
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <div class="flex justify-content-between align-items-center mb-4">
            <div>
              <h5>Prise de présence</h5>
              <p class="text-600 m-0">{{ attendanceData?.formation?.name }}</p>
            </div>
            <div class="flex gap-2">
              <p-button 
                label="Sauvegarder" 
                icon="pi pi-save" 
                styleClass="p-button-success"
                (onClick)="saveAttendance()"
                [loading]="saving">
              </p-button>
              <p-button 
                label="Envoyer à l'admin" 
                icon="pi pi-send" 
                styleClass="p-button-primary"
                (onClick)="sendToAdmin()"
                [loading]="sending"
                [disabled]="!hasAttendanceData">
              </p-button>
            </div>
          </div>

          <div class="grid">
            <div class="col-12 md:col-8">
              <div class="card">
                <h6>Participants</h6>
                <p-table 
                  [value]="attendanceData?.participants || []" 
                  [tableStyle]="{ 'min-width': '50rem' }"
                  [loading]="loading">
                  <ng-template pTemplate="header">
                    <tr>
                      <th>Participant</th>
                      <th>Équipe</th>
                      <th>Statut</th>
                      <th>Notes</th>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-participant>
                    <tr>
                      <td>
                        <div class="flex align-items-center">
                          <i class="pi pi-user mr-2"></i>
                          <div>
                            <div class="font-medium">{{ participant.name }}</div>
                            <div class="text-500 text-sm">{{ participant.email }}</div>
                          </div>
                        </div>
                      </td>
                      <td>{{ participant.team || 'Non assigné' }}</td>
                      <td>
                        <p-dropdown 
                          [options]="statusOptions" 
                          [(ngModel)]="participant.attendance" 
                          placeholder="Sélectionner"
                          styleClass="w-full">
                        </p-dropdown>
                      </td>
                      <td>
                        <input 
                          pInputText 
                          type="text" 
                          placeholder="Notes..."
                          [(ngModel)]="participant.notes"
                          class="w-full">
                      </td>
                    </tr>
                  </ng-template>
                </p-table>
              </div>
            </div>

            <div class="col-12 md:col-4">
              <div class="card">
                <h6>Statistiques</h6>
                <div class="grid">
                  <div class="col-6">
                    <div class="text-center p-3 border-round bg-green-50">
                      <div class="text-green-600 font-bold text-xl">{{ presentCount }}</div>
                      <div class="text-green-600 text-sm">Présents</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="text-center p-3 border-round bg-red-50">
                      <div class="text-red-600 font-bold text-xl">{{ absentCount }}</div>
                      <div class="text-red-600 text-sm">Absents</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="text-center p-3 border-round bg-orange-50">
                      <div class="text-orange-600 font-bold text-xl">{{ lateCount }}</div>
                      <div class="text-orange-600 text-sm">En retard</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="text-center p-3 border-round bg-blue-50">
                      <div class="text-blue-600 font-bold text-xl">{{ attendanceRate }}%</div>
                      <div class="text-blue-600 text-sm">Taux</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card mt-3">
                <h6>Informations formation</h6>
                <div class="space-y-2">
                  <div class="flex justify-content-between">
                    <span class="font-medium">Date :</span>
                    <span>{{ formatDate(attendanceData?.formation?.date) }}</span>
                  </div>
                  <div class="flex justify-content-between">
                    <span class="font-medium">Salle :</span>
                    <span>{{ attendanceData?.formation?.room }}</span>
                  </div>
                  <div class="flex justify-content-between">
                    <span class="font-medium">Participants :</span>
                    <span>{{ attendanceData?.participants?.length || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p-toast></p-toast>
  `,
  providers: [MessageService]
})
export class TakeAttendanceComponent implements OnInit {
  formationId!: number;
  attendanceData?: AttendanceData;
  loading = false;
  saving = false;
  sending = false;
  hasAttendanceData = false;
  presentCount = 0;
  absentCount = 0;
  lateCount = 0;
  attendanceRate = 0;

  statusOptions = [
    { label: 'Présent', value: 'present' },
    { label: 'Absent', value: 'absent' },
    { label: 'En retard', value: 'late' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private attendanceService: AttendanceService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.formationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadParticipants();
  }

  loadParticipants() {
    this.loading = true;
    this.attendanceService.getFormationParticipants(this.formationId).subscribe({
      next: (data) => {
        this.attendanceData = {
          ...data,
          participants: data.participants.map(p => ({
            ...p,
            attendance: p.attendance || 'absent',
            notes: p.notes || ''
          }))
        };
        this.updateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des participants:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les participants'
        });
        this.loading = false;
      }
    });
  }

  saveAttendance() {
    if (!this.attendanceData?.participants) return;

    this.saving = true;
    const attendances: Attendance[] = this.attendanceData.participants.map(p => ({
      formation_id: this.formationId,
      user_id: p.id,
      status: p.attendance as 'present' | 'absent' | 'late',
      notes: p.notes || '',
      taken_by: 0,
      sent_to_admin: false
    }));

    this.attendanceService.takeAttendance(this.formationId, attendances).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Présence sauvegardée avec succès'
        });
        this.hasAttendanceData = true;
        this.saving = false;
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de sauvegarder la présence'
        });
        this.saving = false;
      }
    });
  }

  sendToAdmin() {
    this.sending = true;
    this.attendanceService.sendToAdmin(this.formationId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Liste de présence envoyée à l\'administrateur'
        });
        this.sending = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible d\'envoyer la liste à l\'administrateur'
        });
        this.sending = false;
      }
    });
  }

  updateStats() {
    if (!this.attendanceData?.participants) return;

    this.presentCount = this.attendanceData.participants.filter(p => p.attendance === 'present').length;
    this.absentCount = this.attendanceData.participants.filter(p => p.attendance === 'absent').length;
    this.lateCount = this.attendanceData.participants.filter(p => p.attendance === 'late').length;

    const total = this.attendanceData.participants.length;
    this.attendanceRate = total > 0 ? Math.round((this.presentCount / total) * 100) : 0;
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}