import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTreeModule } from '@angular/material/tree';
import { OfficesService } from '../../../core/services/offices.service';

interface Office {
  id: string;
  name: string;
  code: string;
  description: string;
  parentId: string | null;
  status: boolean;
  children?: Office[];
}

@Component({
  selector: 'app-offices',
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
    MatSelectModule,
    MatSlideToggleModule,
    MatTreeModule
  ],
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss']
})
export class OfficesComponent {
  constructor(private readonly officesService: OfficesService) {}

  showCreateForm: boolean = false;
  searchTerm: string = '';

  offices: Office[] = [];

  parentOffices: Office[] = [
    { id: '0', name: 'Ninguna (es oficina principal)', code: '', description: '', parentId: null, status: true },
    ...this.offices
  ];

  newOffice: Office = {
    id: '0',
    name: '',
    code: '',
    description: '',
    parentId: null,
    status: true
  };

  // Control de modo edición
  isEditing: boolean = false;
  editingId: string = '';

  ngOnInit(): void {
    this.loadOffices();
  }

  private loadOffices(): void {
    this.officesService.list().subscribe({
      next: (data) => {
        this.offices = data;
        this.parentOffices = [
          {
            id: '0',
            name: 'Ninguna (es oficina principal)',
            code: '',
            description: '',
            parentId: null,
            status: true,
          },
          ...this.offices,
        ];
      },
      error: () => {
        this.offices = [];
      },
    });
  }

  displayedColumns: string[] = ['name', 'code', 'status', 'actions'];

  get filteredOffices(): Office[] {
    if (!this.searchTerm) return this.offices;
    const term = this.searchTerm.toLowerCase();
    return this.offices.filter(o =>
      o.name.toLowerCase().includes(term) ||
      o.code.toLowerCase().includes(term)
    );
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.newOffice = { id: '0', name: '', code: '', description: '', parentId: null, status: true };
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  createOffice(): void {
    if (this.newOffice.name && this.newOffice.code) {
      const payload = {
        name: this.newOffice.name,
        code: this.newOffice.code,
        description: this.newOffice.description,
        parentId: this.newOffice.parentId === '0' ? null : this.newOffice.parentId,
        status: this.newOffice.status,
      };

      if (this.isEditing) {
        // Modo edición
        this.officesService.update(this.editingId, payload).subscribe({
          next: () => {
            this.closeCreateForm();
            this.resetForm();
            this.loadOffices();
            alert('Oficina actualizada exitosamente');
          },
          error: () => alert('No se pudo actualizar la oficina'),
        });
      } else {
        // Modo creación
        this.officesService.create(payload).subscribe({
          next: () => {
            this.closeCreateForm();
            this.resetForm();
            this.loadOffices();
            alert('Oficina creada exitosamente');
          },
          error: () => alert('No se pudo crear la oficina'),
        });
      }
    } else {
      alert('Complete los campos requeridos');
    }
  }

  editOffice(office: Office): void {
    this.isEditing = true;
    this.editingId = office.id;
    this.newOffice = {
      id: office.id,
      name: office.name,
      code: office.code,
      description: office.description,
      parentId: office.parentId,
      status: office.status
    };
    this.showCreateForm = true;
  }

  resetForm(): void {
    this.isEditing = false;
    this.editingId = '';
    this.newOffice = { id: '0', name: '', code: '', description: '', parentId: null, status: true };
  }

  deleteOffice(id: string): void {
    if (confirm('¿Eliminar esta oficina?')) {
      this.officesService.remove(id).subscribe({
        next: () => this.loadOffices(),
        error: () => alert('No se pudo eliminar la oficina'),
      });
    }
  }

  toggleStatus(office: Office): void {
    this.officesService.update(office.id, { status: !office.status }).subscribe({
      next: () => this.loadOffices(),
      error: () => alert('No se pudo actualizar estado'),
    });
  }
}
