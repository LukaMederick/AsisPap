import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService, Theme } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentTheme: Theme = 'system';
  appliedTheme: string = 'light';
  private subscriptions: Subscription = new Subscription();

  constructor(
    private themeService: ThemeService,
    readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.themeService.currentTheme$.subscribe(theme => {
        this.currentTheme = theme;
      })
    );

    this.subscriptions.add(
      this.themeService.appliedTheme$.subscribe(theme => {
        this.appliedTheme = theme;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  logout(): void {
    this.auth.logout();
  }

  getThemeIcon(): string {
    switch (this.currentTheme) {
      case 'light': return 'wb_sunny';
      case 'dark': return 'nightlight';
      case 'system': return 'settings_brightness';
      default: return 'settings_brightness';
    }
  }
}
