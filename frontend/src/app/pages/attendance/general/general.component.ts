import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';  // ← AGREGAR ESTE IMPORT

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatIconModule  // ← AGREGAR AQUÍ
  ],
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent {
  months: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  years: number[] = [2024, 2025, 2026, 2027];
  offices: string[] = ['Todas las oficinas', 'UNIDAD DE RECURSOS HUMANOS', 'OFICINA DE ADMINISTRACION', 'DIRECCION REGIONAL'];
  schedules: string[] = ['HORARIO 8AM - 4PM', 'HORARIO 9AM - 5PM', 'HORARIO 7AM - 3PM'];

  selectedMonth: string = 'Abril';
  selectedYear: number = 2026;
  selectedOffice: string = 'Todas las oficinas';
  selectedSchedule: string = 'HORARIO 8AM - 4PM';

  showWorkdaysOnly: boolean = false;
  showAllRecords: boolean = false;
  showPermissionExits: boolean = false;

  searchReports(): void {
    alert('Buscando registros de asistencia...');
  }
}
