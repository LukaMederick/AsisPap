import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<Theme>('system');
  public currentTheme$ = this.currentThemeSubject.asObservable();

  private appliedThemeSubject = new BehaviorSubject<string>('light');
  public appliedTheme$ = this.appliedThemeSubject.asObservable();

  constructor() {
    // Cargar tema guardado o usar 'system' por defecto
    const savedTheme = localStorage.getItem('theme') as Theme || 'system';
    this.setTheme(savedTheme);

    // Escuchar cambios en la preferencia del sistema
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (this.currentThemeSubject.value === 'system') {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(prefersDark ? 'dark' : 'light');
    } else {
      this.applyTheme(theme);
    }
  }

  private applyTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
    this.appliedThemeSubject.next(theme);
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  getAppliedTheme(): string {
    return this.appliedThemeSubject.value;
  }
}
