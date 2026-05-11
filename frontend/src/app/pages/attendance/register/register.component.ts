import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { UsersService } from '../../../core/services/users.service';
import { AttendanceRecordsService } from '../../../core/services/attendance-records.service';

interface AttendanceRecord {
  datetime: string;
  type: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(
    private readonly usersService: UsersService,
    private readonly attendanceRecordsService: AttendanceRecordsService,
  ) {}

  currentDateTime: string = new Date().toLocaleString('es-PE');
  selectedWorker: string = '';
  markType: string = 'Entrada';
  locationError: boolean = false;
  workerMap: Record<string, string> = {};

  workers: string[] = [];

  markTypes: string[] = ['Entrada', 'Salida', 'Salida de papeleta', 'Retorno de papeleta'];

  displayedColumns: string[] = ['datetime', 'type'];

  lastMarks: AttendanceRecord[] = [];

  ngOnInit(): void {
    this.usersService.list().subscribe({
      next: (rows) => {
        this.workers = rows.map((u) => `${u.lastName}, ${u.firstName}`);
        this.workerMap = Object.fromEntries(rows.map((u) => [`${u.lastName}, ${u.firstName}`, String(u.id)]));
      },
      error: () => {
        this.workers = [];
      },
    });

    this.attendanceRecordsService.list().subscribe({
      next: (rows) => {
        this.lastMarks = rows.slice(0, 10).map((r) => ({
          datetime: new Date(r.markDatetime).toLocaleString('es-PE'),
          type: r.markType,
        }));
      },
      error: () => {
        this.lastMarks = [];
      },
    });
  }

  registerAttendance(): void {
    if (!this.selectedWorker) {
      alert('Seleccione un trabajador');
      return;
    }
    const userId = this.workerMap[this.selectedWorker];
    if (!userId) {
      alert('Trabajador no válido');
      return;
    }
    this.attendanceRecordsService
      .create({
        userId,
        officeId: null,
        markDatetime: new Date().toISOString(),
        markType: this.markType,
        permissionRequestId: null,
      })
      .subscribe({
        next: () => alert(`Asistencia registrada: ${this.selectedWorker} - ${this.markType}`),
        error: () => alert('No se pudo registrar asistencia'),
      });
  }

  retryLocation(): void {
    this.locationError = false;
    alert('Reintentando obtener ubicación...');
  }
}
