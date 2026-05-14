import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../../core/services/users.service';
import { AttendanceRecordsService } from '../../../../core/services/attendance-records.service';
import { PermissionRequestsService } from '../../../../core/services/permission-requests.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard-summary',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './dashboard-summary.component.html',
  styleUrl: './dashboard-summary.component.scss'
})
export class DashboardSummaryComponent implements OnInit {
  summaryCards: any[] = [];

  constructor(
    private usersService: UsersService,
    private attendanceRecordsService: AttendanceRecordsService,
    private permissionRequestsService: PermissionRequestsService
  ) {}

  async ngOnInit() {
    try {
      const [users, attendances, requests] = await Promise.all([
        firstValueFrom(this.usersService.list()),
        firstValueFrom(this.attendanceRecordsService.list()),
        firstValueFrom(this.permissionRequestsService.list())
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayAttendances = (attendances || []).filter((a: any) => {
        const markDate = new Date(a.markDatetime);
        return markDate >= today && a.markType === 'Entrada';
      });

      const lateAttendances = todayAttendances.filter((a: any) => {
        const markDate = new Date(a.markDatetime);
        return markDate.getHours() > 8 || (markDate.getHours() === 8 && markDate.getMinutes() > 30);
      });

      const todayRequests = (requests || []).filter((r: any) => {
        if (!r.requestDate) return false;
        const reqParts = r.requestDate.split('-');
        if (reqParts.length !== 3) return false;
        const reqDate = new Date(Number(reqParts[0]), Number(reqParts[1]) - 1, Number(reqParts[2]));
        return reqDate.getTime() === today.getTime() && r.status === 'Autorizado';
      });

      const totalUsers = (users || []).length;
      const presentCount = new Set(todayAttendances.map((a: any) => a.userId)).size;
      const absentCount = totalUsers - presentCount;

      this.summaryCards = [
        {
          title: 'Presentes Hoy',
          value: presentCount.toString(),
          icon: 'check_circle',
          colorClass: 'success',
          trendText: `${presentCount} de ${totalUsers} registrados`,
          trendUp: true
        },
        {
          title: 'Tardanzas',
          value: lateAttendances.length.toString(),
          icon: 'schedule',
          colorClass: 'warning',
          trendText: 'Ingresos después de 8:30 AM',
          trendUp: false
        },
        {
          title: 'Permisos Aprobados',
          value: todayRequests.length.toString(),
          icon: 'assignment_turned_in',
          colorClass: 'info',
          trendText: 'Papeletas autorizadas hoy',
          trendUp: true
        },
        {
          title: 'Ausentes',
          value: Math.max(0, absentCount).toString(),
          icon: 'cancel',
          colorClass: 'danger',
          trendText: 'Sin registro de entrada',
          trendUp: false
        }
      ];
    } catch (error) {
      console.error('Error loading dashboard summary', error);
    }
  }
}
