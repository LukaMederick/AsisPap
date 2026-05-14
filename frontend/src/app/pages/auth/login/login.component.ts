import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

/** DNI peruano: 8 dígitos (ajusta el patrón si tu región es otra). */
const DNI_PATTERN = /^\d{8}$/;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Sustituye por tu imagen en public/images/ (mismo nombre) o cambia la ruta aquí. */
  readonly heroImageSrc = '/images/login-hero.svg';

  readonly showPassword = signal(false);

  submitting = false;
  errorMessage: string | null = null;

  readonly form = this.fb.nonNullable.group({
    dni: ['', [Validators.required, Validators.pattern(DNI_PATTERN)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  submit(): void {
    this.errorMessage = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { dni, password } = this.form.getRawValue();
    this.submitting = true;
    this.auth.login(dni, password).subscribe({
      next: (ok) => {
        this.submitting = false;
        if (ok) {
          void this.router.navigateByUrl(this.auth.getDefaultHomePath());
        } else {
          this.errorMessage =
            'No se pudo iniciar sesión. Verifica DNI (8 dígitos), contraseña y que el servidor esté en marcha.';
        }
      },
      error: () => {
        this.submitting = false;
        this.errorMessage = 'No se pudo iniciar sesión. Intenta de nuevo.';
      }
    });
  }
}
