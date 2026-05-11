import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { PermissionRequestsService } from '../../../core/services/permission-requests.service';

interface Permission {
  id: string;
  type: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  employee: string;
  office: string;
}

@Component({
  selector: 'app-all',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']  // ← DEBE SER EXACTAMENTE ASÍ
})
export class AllComponent {
  constructor(private readonly permissionRequestsService: PermissionRequestsService) {}

  displayedColumns: string[] = ['id', 'type', 'description', 'date', 'status', 'actions'];

  totalPermissions: number = 0;
  totalRegistered: number = 0;

  permissions: Permission[] = [];

  ngOnInit(): void {
    this.permissionRequestsService.list().subscribe({
      next: (rows) => {
        this.permissions = rows.map((r) => ({
          id: r.code ?? String(r.id),
          type: r.permissionType?.name ?? '-',
          description: r.description ?? '',
          date: r.requestDate,
          startTime: r.startTime,
          endTime: r.endTime,
          status: r.status,
          employee: r.user ? `${r.user.lastName}, ${r.user.firstName}` : '-',
          office: r.office?.name ?? '-',
        }));
        this.totalPermissions = this.permissions.length;
      },
      error: () => {
        this.permissions = [];
      },
    });
  }

  getStatusColor(status: string): string {
    return status === 'Autorizado' ? 'primary' : 'warn';
  }

  printPermission(id: string): void {
    const permissionData = this.permissions.find(p => p.id === id);
    if (permissionData) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Papeleta de Permiso - ${permissionData.id}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                .details { margin-bottom: 20px; }
                .detail-row { display: flex; margin-bottom: 8px; }
                .label { font-weight: bold; width: 150px; }
                .value { flex: 1; }
                .status { padding: 5px 10px; border-radius: 4px; color: white; display: inline-block; }
                .status-Autorizado { background-color: #4CAF50; }
                .status-Pendiente { background-color: #FF9800; }
                .status-Rechazado { background-color: #F44336; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Papeleta de Permiso</h1>
                <h2>Código: ${permissionData.id}</h2>
              </div>
              <div class="details">
                <div class="detail-row">
                  <span class="label">Empleado:</span>
                  <span class="value">${permissionData.employee}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Área/Oficina:</span>
                  <span class="value">${permissionData.office}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Tipo de Permiso:</span>
                  <span class="value">${permissionData.type}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Fecha de Solicitud:</span>
                  <span class="value">${permissionData.date}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Horario:</span>
                  <span class="value">${permissionData.startTime} - ${permissionData.endTime}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Descripción:</span>
                  <span class="value">${permissionData.description}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Estado:</span>
                  <span class="value">
                    <span class="status status-${permissionData.status}">${permissionData.status}</span>
                  </span>
                </div>
              </div>
              <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                <p>Fecha de impresión: ${new Date().toLocaleString()}</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  }
}
