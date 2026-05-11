import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PermissionTypesService } from '../../../core/services/permission-types.service';
import { PermissionRequestsService } from '../../../core/services/permission-requests.service';


interface PermissionReview {
  id: string;
  employee: string;
  area: string;
  type: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface PermissionDetails {
  id: string;
  code?: string;
  employee: {
    firstName: string;
    lastName: string;
    email?: string;
  };
  office: {
    name: string;
  };
  permissionType: {
    name: string;
  };
  description: string;
  requestDate: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent {
  constructor(
    private readonly permissionTypesService: PermissionTypesService,
    private readonly permissionRequestsService: PermissionRequestsService,
    private readonly dialog: MatDialog
  ) {}

  displayedColumns: string[] = ['id', 'employee', 'type', 'description', 'date', 'status', 'actions'];

  totalPermissions: number = 0;
  totalRegistered2026: number = 0;
  pendingPermissions: number = 0;
  authorizedPermissions: number = 0;
  rejectedPermissions: number = 0;

  // Filtros
  searchTerm: string = '';
  selectedType: string = '';
  selectedStatus: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  // Tipos de papeleta para filtro
  permissionTypes: string[] = [];

  // Estados para filtro
  statuses: string[] = ['Autorizado', 'Pendiente', 'Rechazado'];

  permissions: PermissionReview[] = [];
  allPermissionsData: any[] = []; // Para almacenar los datos completos

  ngOnInit(): void {
    this.permissionTypesService.list().subscribe({
      next: (rows) => (this.permissionTypes = rows.map((r) => r.name)),
      error: () => (this.permissionTypes = []),
    });

    this.permissionRequestsService.list().subscribe({
      next: (rows) => {
        this.allPermissionsData = rows; // Guardar datos completos
        this.permissions = rows.map((r) => ({
          id: r.code ?? String(r.id),
          employee: r.user ? `${r.user.lastName}, ${r.user.firstName}` : '-',
          area: r.office?.name ?? '-',
          type: r.permissionType?.name ?? '-',
          description: r.description ?? '',
          date: r.requestDate,
          startTime: r.startTime,
          endTime: r.endTime,
          status: r.status,
        }));

        this.totalPermissions = this.permissions.length;
        this.pendingPermissions = this.permissions.filter((p) => p.status === 'Pendiente').length;
        this.authorizedPermissions = this.permissions.filter((p) => p.status === 'Autorizado').length;
        this.rejectedPermissions = this.permissions.filter((p) => p.status === 'Rechazado').length;
      },
      error: () => {
        this.permissions = [];
        this.allPermissionsData = [];
      },
    });
  }

  get filteredPermissions(): PermissionReview[] {
    let filtered = this.permissions;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.id.toLowerCase().includes(term) ||
        p.employee.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    if (this.selectedType) {
      filtered = filtered.filter(p => p.type === this.selectedType);
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(p => p.status === this.selectedStatus);
    }

    return filtered;
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'Autorizado': return 'primary';
      case 'Pendiente': return 'warn';
      case 'Rechazado': return 'accent';
      default: return 'default';
    }
  }

  viewPermission(id: string): void {
    const permissionData = this.allPermissionsData.find(p => (p.code ?? String(p.id)) === id);
    if (permissionData) {
      this.dialog.open(PermissionDetailsDialogComponent, {
        width: '600px',
        data: permissionData
      });
    }
  }

  cancelPermission(id: string): void {
    if (confirm('¿Anular esta papeleta? Esta acción no se puede deshacer.')) {
      // Buscar la papeleta completa para obtener el ID real
      const permissionData = this.allPermissionsData.find(p => (p.code ?? String(p.id)) === id);
      if (permissionData) {
        this.permissionRequestsService.remove(String(permissionData.id)).subscribe({
          next: () => {
            alert('Papeleta anulada exitosamente');
            this.ngOnInit(); // Recargar la lista
          },
          error: () => {
            alert('Error al anular la papeleta');
          }
        });
      }
    }
  }

  approvePermission(id: string): void {
    if (confirm('¿Aprobar esta papeleta de permiso?')) {
      // Buscar la papeleta completa para obtener el ID real
      const permissionData = this.allPermissionsData.find(p => (p.code ?? String(p.id)) === id);
      if (permissionData) {
        this.permissionRequestsService.update(String(permissionData.id), { status: 'Autorizado' }).subscribe({
          next: () => {
            alert('Papeleta aprobada exitosamente');
            this.ngOnInit(); // Recargar la lista
          },
          error: () => {
            alert('Error al aprobar la papeleta');
          }
        });
      }
    }
  }

  rejectPermission(id: string): void {
    if (confirm('¿Rechazar esta papeleta de permiso?')) {
      // Buscar la papeleta completa para obtener el ID real
      const permissionData = this.allPermissionsData.find(p => (p.code ?? String(p.id)) === id);
      if (permissionData) {
        this.permissionRequestsService.update(String(permissionData.id), { status: 'Rechazado' }).subscribe({
          next: () => {
            alert('Papeleta rechazada exitosamente');
            this.ngOnInit(); // Recargar la lista
          },
          error: () => {
            alert('Error al rechazar la papeleta');
          }
        });
      }
    }
  }

  printPermission(id: string): void {
    const permissionData = this.allPermissionsData.find(p => (p.code ?? String(p.id)) === id);
    if (permissionData) {
      // Abrir ventana de impresión con los detalles de la papeleta
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Papeleta de Permiso - ${permissionData.code ?? permissionData.id}</title>
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
                <h2>Código: ${permissionData.code ?? permissionData.id}</h2>
              </div>
              <div class="details">
                <div class="detail-row">
                  <span class="label">Empleado:</span>
                  <span class="value">${permissionData.user ? `${permissionData.user.lastName}, ${permissionData.user.firstName}` : '-'}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Área/Oficina:</span>
                  <span class="value">${permissionData.office?.name ?? '-'}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Tipo de Permiso:</span>
                  <span class="value">${permissionData.permissionType?.name ?? '-'}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Fecha de Solicitud:</span>
                  <span class="value">${permissionData.requestDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Horario:</span>
                  <span class="value">${permissionData.startTime} - ${permissionData.endTime}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Descripción:</span>
                  <span class="value">${permissionData.description ?? ''}</span>
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

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedType = '';
    this.selectedStatus = '';
    this.startDate = null;
    this.endDate = null;
  }
}

// Componente del modal para mostrar detalles de la papeleta
@Component({
  selector: 'app-permission-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>Detalles de la Papeleta</h2>
      <mat-dialog-content>
        <div class="details-grid">
          <div class="detail-item">
            <strong>Código:</strong> {{ data.code ?? data.id }}
          </div>
          <div class="detail-item">
            <strong>Empleado:</strong> {{ data.user ? data.user.lastName + ', ' + data.user.firstName : '-' }}
          </div>
          <div class="detail-item">
            <strong>Email:</strong> {{ data.user?.email ?? '-' }}
          </div>
          <div class="detail-item">
            <strong>Área/Oficina:</strong> {{ data.office?.name ?? '-' }}
          </div>
          <div class="detail-item">
            <strong>Tipo de Permiso:</strong> {{ data.permissionType?.name ?? '-' }}
          </div>
          <div class="detail-item">
            <strong>Fecha de Solicitud:</strong> {{ data.requestDate }}
          </div>
          <div class="detail-item">
            <strong>Horario:</strong> {{ data.startTime }} - {{ data.endTime }}
          </div>
          <div class="detail-item">
            <strong>Descripción:</strong> {{ data.description ?? '-' }}
          </div>
          <div class="detail-item">
            <strong>Estado:</strong>
            <mat-chip [color]="getStatusColor(data.status)" highlighted>
              {{ data.status }}
            </mat-chip>
          </div>
          <div class="detail-item" *ngIf="data.createdAt">
            <strong>Fecha de Creación:</strong> {{ data.createdAt }}
          </div>
          <div class="detail-item" *ngIf="data.updatedAt">
            <strong>Última Actualización:</strong> {{ data.updatedAt }}
          </div>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cerrar</button>
        <button mat-raised-button color="primary" (click)="print()">
          <mat-icon>print</mat-icon>
          Imprimir
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 500px;
    }
    .details-grid {
      display: grid;
      gap: 12px;
    }
    .detail-item {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .detail-item strong {
      min-width: 140px;
      color: #666;
    }
  `]
})
export class PermissionDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PermissionDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  getStatusColor(status: string): string {
    switch(status) {
      case 'Autorizado': return 'primary';
      case 'Pendiente': return 'warn';
      case 'Rechazado': return 'accent';
      default: return 'default';
    }
  }

  print(): void {
    // Abrir ventana de impresión con los detalles de la papeleta
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Papeleta de Permiso - ${this.data.code ?? this.data.id}</title>
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
              <h2>Código: ${this.data.code ?? this.data.id}</h2>
            </div>
            <div class="details">
              <div class="detail-row">
                <span class="label">Empleado:</span>
                <span class="value">${this.data.user ? `${this.data.user.lastName}, ${this.data.user.firstName}` : '-'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">${this.data.user?.email ?? '-'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Área/Oficina:</span>
                <span class="value">${this.data.office?.name ?? '-'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Tipo de Permiso:</span>
                <span class="value">${this.data.permissionType?.name ?? '-'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Fecha de Solicitud:</span>
                <span class="value">${this.data.requestDate}</span>
              </div>
              <div class="detail-row">
                <span class="label">Horario:</span>
                <span class="value">${this.data.startTime} - ${this.data.endTime}</span>
              </div>
              <div class="detail-row">
                <span class="label">Descripción:</span>
                <span class="value">${this.data.description ?? '-'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Estado:</span>
                <span class="value">
                  <span class="status status-${this.data.status}">${this.data.status}</span>
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
