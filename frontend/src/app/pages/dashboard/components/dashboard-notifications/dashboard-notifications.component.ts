import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PermissionRequestsService } from '../../../../core/services/permission-requests.service';
import { AttendanceRecordsService } from '../../../../core/services/attendance-records.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard-notifications',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-notifications.component.html',
  styleUrl: './dashboard-notifications.component.scss'
})
export class DashboardNotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(
    private permissionRequestsService: PermissionRequestsService,
    private attendanceRecordsService: AttendanceRecordsService
  ) {}

  async ngOnInit() {
    try {
      const [requests, attendances] = await Promise.all([
        firstValueFrom(this.permissionRequestsService.list()),
        firstValueFrom(this.attendanceRecordsService.list())
      ]);

      const items: any[] = [];

      (requests || []).forEach((req: any) => {
        const date = new Date(req.createdAt || req.updatedAt || Date.now());
        items.push({
          date,
          icon: req.status === 'Autorizado' ? 'assignment_turned_in' : (req.status === 'Rechazado' ? 'cancel' : 'notification_important'),
          colorClass: req.status === 'Autorizado' ? 'primary' : (req.status === 'Rechazado' ? 'danger' : 'warning'),
          title: `Permiso ${req.status.toLowerCase()}`,
          description: `Papeleta de ${req.user?.firstName || 'usuario'} ${req.user?.lastName || ''} actualizada.`,
        });
      });

      (attendances || []).forEach((att: any) => {
        const date = new Date(att.createdAt || att.markDatetime || Date.now());
        items.push({
          date,
          icon: 'check_circle',
          colorClass: 'success',
          title: `Asistencia: ${att.markType}`,
          description: `${att.user?.firstName || 'Usuario'} ${att.user?.lastName || ''} registró ${att.markType.toLowerCase()}.`,
        });
      });

      items.sort((a, b) => b.date.getTime() - a.date.getTime());

      const now = new Date().getTime();
      this.notifications = items.slice(0, 5).map(item => {
        const diffMs = Math.max(0, now - item.date.getTime());
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        let timeStr = 'Recientemente';
        if (diffDays > 0) timeStr = `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
        else if (diffHours > 0) timeStr = `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        else if (diffMins > 0) timeStr = `Hace ${diffMins} min`;

        return { ...item, time: timeStr };
      });

    } catch (error) {
      console.error('Error loading notifications', error);
    }
  }
}
