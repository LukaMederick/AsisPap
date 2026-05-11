import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PermissionTypesService } from '../../../core/services/permission-types.service';
import { PermissionRequestsService } from '../../../core/services/permission-requests.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']  // ← DEBE SER EXACTAMENTE ASÍ
})
export class CreateComponent {
  constructor(
    private readonly permissionTypesService: PermissionTypesService,
    private readonly permissionRequestsService: PermissionRequestsService,
  ) {}

  permissionTypes: string[] = [];
  permissionTypeMap: Record<string, string> = {};

  selectedType: string = '';
  selectedDate: Date = new Date();
  startTime: string = '';
  endTime: string = '';
  description: string = '';

  ngOnInit(): void {
    this.permissionTypesService.list().subscribe({
      next: (rows) => {
        this.permissionTypes = rows.map((r) => r.name);
        this.permissionTypeMap = Object.fromEntries(rows.map((r) => [r.name, r.id]));
      },
      error: () => {
        this.permissionTypes = [];
      },
    });
  }

  onSubmit(): void {
    const permissionTypeId = this.permissionTypeMap[this.selectedType];
    if (!permissionTypeId) {
      alert('Seleccione un tipo de papeleta válido');
      return;
    }

    this.permissionRequestsService
      .create({
        userId: 1,
        permissionTypeId: Number(permissionTypeId),
        requestDate: this.selectedDate.toISOString().slice(0, 10),
        startTime: this.startTime,
        endTime: this.endTime,
        description: this.description,
        status: 'Pendiente',
      })
      .subscribe({
        next: () => alert('Papeleta creada exitosamente'),
        error: () => alert('No se pudo crear papeleta'),
      });
  }
}
