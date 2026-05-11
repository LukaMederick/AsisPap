import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SchedulesService } from '../../../core/services/schedules.service';

interface Schedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  status: boolean;
}

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule
  ],
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss']
})
export class SchedulesComponent {
  constructor(private readonly schedulesService: SchedulesService) {}

  displayedColumns: string[] = ['name', 'startTime', 'endTime', 'status', 'actions'];
  searchTerm: string = '';

  schedules: Schedule[] = [];

  showCreateForm: boolean = false;
  newSchedule: Schedule = {
    id: '0',
    name: '',
    startTime: '',
    endTime: '',
    status: true
  };

  // Control de modo edición
  isEditing: boolean = false;
  editingId: string = '';

  ngOnInit(): void {
    this.loadSchedules();
  }

  private loadSchedules(): void {
    this.schedulesService.list().subscribe({
      next: (data) => {
        this.schedules = data;
      },
      error: () => {
        this.schedules = [];
      },
    });
  }

  get filteredSchedules(): Schedule[] {
    if (!this.searchTerm) return this.schedules;
    const term = this.searchTerm.toLowerCase();
    return this.schedules.filter(s => s.name.toLowerCase().includes(term));
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.newSchedule = { id: '0', name: '', startTime: '', endTime: '', status: true };
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  createSchedule(): void {
    if (this.newSchedule.name && this.newSchedule.startTime && this.newSchedule.endTime) {
      if (this.isEditing) {
        // Modo edición
        this.schedulesService.update(this.editingId, {
          name: this.newSchedule.name,
          startTime: this.newSchedule.startTime,
          endTime: this.newSchedule.endTime,
          status: this.newSchedule.status,
        }).subscribe({
          next: () => {
            this.closeCreateForm();
            this.resetForm();
            this.loadSchedules();
            alert('Horario actualizado exitosamente');
          },
          error: () => alert('No se pudo actualizar horario'),
        });
      } else {
        // Modo creación
        this.schedulesService.create({
          name: this.newSchedule.name,
          startTime: this.newSchedule.startTime,
          endTime: this.newSchedule.endTime,
          status: this.newSchedule.status,
        }).subscribe({
          next: () => {
            this.closeCreateForm();
            this.resetForm();
            this.loadSchedules();
            alert('Horario creado exitosamente');
          },
          error: () => alert('No se pudo crear horario'),
        });
      }
    } else {
      alert('Complete todos los campos');
    }
  }

  editSchedule(schedule: Schedule): void {
    this.isEditing = true;
    this.editingId = schedule.id;
    this.newSchedule = {
      id: schedule.id,
      name: schedule.name,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      status: schedule.status
    };
    this.showCreateForm = true;
  }

  resetForm(): void {
    this.isEditing = false;
    this.editingId = '';
    this.newSchedule = { id: '0', name: '', startTime: '', endTime: '', status: true };
  }

  deleteSchedule(id: string): void {
    if (confirm('¿Eliminar este horario?')) {
      this.schedulesService.remove(id).subscribe({
        next: () => this.loadSchedules(),
        error: () => alert('No se pudo eliminar horario'),
      });
    }
  }

  toggleStatus(schedule: Schedule): void {
    this.schedulesService.update(schedule.id, { status: !schedule.status }).subscribe({
      next: () => this.loadSchedules(),
      error: () => alert('No se pudo actualizar estado'),
    });
  }
}
