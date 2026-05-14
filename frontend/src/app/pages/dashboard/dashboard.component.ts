import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardSummaryComponent } from './components/dashboard-summary/dashboard-summary.component';
import { DashboardBirthdaysComponent } from './components/dashboard-birthdays/dashboard-birthdays.component';
import { DashboardNotificationsComponent } from './components/dashboard-notifications/dashboard-notifications.component';
import { DashboardChartsComponent } from './components/dashboard-charts/dashboard-charts.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardSummaryComponent,
    DashboardBirthdaysComponent,
    DashboardNotificationsComponent,
    DashboardChartsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {}
