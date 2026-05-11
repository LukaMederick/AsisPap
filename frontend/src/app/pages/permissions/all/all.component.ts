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
    alert('Imprimir papeleta: ' + id);
  }
}
