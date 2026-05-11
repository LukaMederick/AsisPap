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
import { MatTabsModule } from '@angular/material/tabs';
import { UsersService } from '../../../core/services/users.service';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone: string | null;
  officeId: string;
  officeName?: string;
  gender: string | null;
  birthDate: string | null;
  status: boolean;
}

@Component({
  selector: 'app-users',
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
    MatTabsModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  constructor(private readonly usersService: UsersService) {}

  showCreateForm: boolean = false;
  searchTerm: string = '';

  totalUsers: number = 0;
  activeUsers: number = 0;
  inactiveUsers: number = 0;

  offices: string[] = [
    'UNIDAD DE RECURSOS HUMANOS',
    'DIRECCION DE GESTION INSTITUCIONAL',
    'CENTRO DE RECURSOS PARA EL APRENDIZAJE - CRAEI',
    'OFICINA DE ADMINISTRACIÓN',
    'DIRECCION DE GESTION PEDAGÓGICA'
  ];

  genders: string[] = ['Masculino', 'Femenino'];

  users: User[] = [];

  displayedColumns: string[] = ['name', 'email', 'office', 'status', 'actions'];

  newUser: User = {
    id: '0',
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    phone: null,
    officeId: '',
    officeName: '',
    gender: null,
    birthDate: null,
    status: true
  };

  password = '';
  confirmPassword = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.usersService.list().subscribe({
      next: (data) => {
        this.users = data.map((u) => ({
          ...u,
          officeName: u.office?.name ?? '',
        }));
        this.totalUsers = this.users.length;
        this.activeUsers = this.users.filter((u) => u.status).length;
        this.inactiveUsers = this.users.filter((u) => !u.status).length;
      },
      error: () => {
        this.users = [];
      },
    });
  }

  get filteredUsers(): User[] {
    if (!this.searchTerm) return this.users;
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(u =>
      u.firstName.toLowerCase().includes(term) ||
      u.lastName.toLowerCase().includes(term) ||
      u.dni.includes(term)
    );
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.password = '';
    this.confirmPassword = '';
    this.newUser = {
      id: '0',
      firstName: '',
      lastName: '',
      dni: '',
      email: '',
      phone: null,
      officeId: '',
      officeName: '',
      gender: null,
      birthDate: null,
      status: true,
    };
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  createUser(): void {
    if (!this.newUser.firstName || !this.newUser.lastName || !this.newUser.dni || !this.newUser.email || !this.newUser.officeId) {
      alert('Complete los campos requeridos (Nombres, Apellidos, DNI, Email, Oficina)');
      return;
    }

    if (!/^\d{8}$/.test(this.newUser.dni)) {
      alert('El DNI debe tener exactamente 8 números');
      return;
    }

    if (!this.newUser.email.includes('@')) {
      alert('El correo electrónico debe ser válido (contener @)');
      return;
    }

    if (!this.password) {
      alert('Debe ingresar una contraseña');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const payload = {
      firstName: this.newUser.firstName,
      lastName: this.newUser.lastName,
      dni: this.newUser.dni,
      email: this.newUser.email,
      phone: this.newUser.phone,
      officeId: this.newUser.officeId,
      gender: this.newUser.gender,
      birthDate: this.newUser.birthDate,
      status: this.newUser.status,
      password: this.password,
    };
    
    this.usersService.create(payload).subscribe({
      next: () => {
        this.showCreateForm = false;
        this.loadUsers();
        alert('Usuario creado exitosamente');
      },
      error: () => alert('No se pudo crear usuario'),
    });
  }

  editUser(user: User): void {
    alert('Editar usuario: ' + user.firstName + ' ' + user.lastName);
  }

  deleteUser(id: string): void {
    if (confirm('¿Eliminar este usuario?')) {
      this.usersService.remove(id).subscribe({
        next: () => this.loadUsers(),
        error: () => alert('No se pudo eliminar el usuario'),
      });
    }
  }

  toggleStatus(user: User): void {
    this.usersService.update(user.id, { status: !user.status }).subscribe({
      next: () => this.loadUsers(),
      error: () => alert('No se pudo actualizar estado'),
    });
  }

  changePassword(user: User): void {
    alert('Cambiar contraseña para: ' + user.email);
  }
}
