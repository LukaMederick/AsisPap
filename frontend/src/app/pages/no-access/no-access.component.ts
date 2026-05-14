import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-no-access',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="wrap">
      <mat-card>
        <mat-card-header>
          <div mat-card-avatar class="avatar"><mat-icon>lock</mat-icon></div>
          <mat-card-title>Sin módulos asignados</mat-card-title>
          <mat-card-subtitle
            >Tu usuario no tiene permisos de módulo en el sistema. Pide a un administrador que asigne un rol con
            acceso (Dashboard, Asistencia, Papeletas o Directorio).</mat-card-subtitle
          >
        </mat-card-header>
        <mat-card-actions align="end">
          <button mat-stroked-button color="primary" type="button" (click)="auth.logout()">
            <mat-icon>logout</mat-icon>
            Cerrar sesión
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .wrap {
        max-width: 520px;
        margin: 48px auto;
        padding: 0 16px;
      }
      .avatar {
        background: rgba(239, 68, 68, 0.12);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .avatar mat-icon {
        color: var(--error-color, #ef4444);
      }
    `
  ]
})
export class NoAccessComponent {
  readonly auth = inject(AuthService);
}
