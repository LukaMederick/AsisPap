import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { AppModule, AuthSession, UserAccessDto } from '../models/app-module';

const SESSION_KEY = 'papeletas_session';
const LEGACY_TOKEN = 'auth_token';
const LEGACY_USER = 'auth_user';

const HOME_PRIORITY: { path: string; module: AppModule }[] = [
  { path: '/dashboard', module: 'dashboard' },
  { path: '/attendance/general', module: 'attendance' },
  { path: '/permissions/review', module: 'permissions' },
  { path: '/directory/offices', module: 'directory' }
];

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _session = signal<AuthSession | null>(this.readSession());

  readonly session = this._session.asReadonly();
  readonly displayName = computed(() => this._session()?.fullName ?? this._session()?.dni ?? 'Usuario');
  readonly rolesLabel = computed(() => {
    const r = this._session()?.roles ?? [];
    if (!r.length) return '';
    return r.map((x) => x.name).join(', ');
  });

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient
  ) {
    this.clearLegacyKeys();
  }

  isLoggedIn(): boolean {
    return !!this._session();
  }

  hasModule(slug: string): boolean {
    const m = this._session()?.modules ?? [];
    return m.includes(slug);
  }

  getDefaultHomePath(): string {
    for (const { path, module } of HOME_PRIORITY) {
      if (this.hasModule(module)) {
        return path;
      }
    }
    return '/no-access';
  }

  /**
   * Valida DNI/contraseña mínima y carga permisos desde el backend (`GET .../users/access/:dni`).
   * Requiere API en marcha y datos de permisos por módulo en BD.
   */
  login(dni: string, password: string): Observable<boolean> {
    const trimmed = dni.trim();
    if (!trimmed || !password || password.length < 4) {
      return of(false);
    }
    const url = `${environment.apiUrl}/api/users/access/${encodeURIComponent(trimmed)}`;
    return this.http.get<UserAccessDto>(url).pipe(
      tap((dto) => this.persistSession(dto)),
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this._session.set(null);
    void this.router.navigateByUrl('/login');
  }

  private persistSession(dto: UserAccessDto): void {
    const session: AuthSession = { ...dto };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this._session.set(session);
  }

  private readSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AuthSession;
      if (!parsed?.userId || !parsed?.dni || !Array.isArray(parsed.modules)) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  private clearLegacyKeys(): void {
    try {
      if (localStorage.getItem(LEGACY_TOKEN) || localStorage.getItem(LEGACY_USER)) {
        localStorage.removeItem(LEGACY_TOKEN);
        localStorage.removeItem(LEGACY_USER);
      }
    } catch {
      /* ignore */
    }
  }
}
