import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { AttendanceRecordsService } from '../../../../core/services/attendance-records.service';
import { PermissionRequestsService } from '../../../../core/services/permission-requests.service';
import { UsersService } from '../../../../core/services/users.service';
import { firstValueFrom } from 'rxjs';

Chart.register(...registerables);

// Configuración global de Chart.js para un aspecto más moderno
Chart.defaults.font.family = "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif";
Chart.defaults.color = '#6b7280'; // Gris neutro que funciona bien en claro y oscuro
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(17, 24, 39, 0.9)';
Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
Chart.defaults.plugins.tooltip.bodyColor = '#e5e7eb';
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.boxWidth = 8;

@Component({
  selector: 'app-dashboard-charts',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './dashboard-charts.component.html',
  styleUrl: './dashboard-charts.component.scss'
})
export class DashboardChartsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('weeklyChart') weeklyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('officeChart') officeChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('requestsChart') requestsChartRef!: ElementRef<HTMLCanvasElement>;

  private weeklyChartInstance: Chart | null = null;
  private officeChartInstance: Chart | null = null;
  private requestsChartInstance: Chart | null = null;
  
  private platformId = inject(PLATFORM_ID);

  constructor(
    private attendanceRecordsService: AttendanceRecordsService,
    private permissionRequestsService: PermissionRequestsService,
    private usersService: UsersService
  ) {}

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const [attendances, requests, users] = await Promise.all([
          firstValueFrom(this.attendanceRecordsService.list()),
          firstValueFrom(this.permissionRequestsService.list()),
          firstValueFrom(this.usersService.list())
        ]);
        this.createWeeklyChart(attendances || []);
        this.createOfficeChart(users || []);
        this.createRequestsChart(requests || []);
      } catch (error) {
        console.error('Error loading chart data', error);
      }
    }
  }

  ngOnDestroy() {
    if (this.weeklyChartInstance) this.weeklyChartInstance.destroy();
    if (this.officeChartInstance) this.officeChartInstance.destroy();
    if (this.requestsChartInstance) this.requestsChartInstance.destroy();
  }

  createWeeklyChart(attendances: any[]) {
    const ctx = this.weeklyChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Last 5 days
    const labels = [];
    const asistsData = [];
    const latesData = [];

    const today = new Date();
    for (let i = 4; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      labels.push(d.toLocaleDateString('es-ES', { weekday: 'short' }).substring(0, 3));

      const asists = attendances.filter(a => {
        const ad = new Date(a.markDatetime);
        return ad.getDate() === d.getDate() && ad.getMonth() === d.getMonth() && ad.getFullYear() === d.getFullYear() && a.markType === 'Entrada';
      });

      const lates = asists.filter(a => {
        const ad = new Date(a.markDatetime);
        return ad.getHours() > 8 || (ad.getHours() === 8 && ad.getMinutes() > 30);
      });

      asistsData.push(asists.length);
      latesData.push(lates.length);
    }

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Asistencias',
            data: asistsData,
            backgroundColor: '#3b82f6', // blue-500
            hoverBackgroundColor: '#2563eb', // blue-600
            borderRadius: 6,
            barPercentage: 0.6,
          },
          {
            label: 'Tardanzas',
            data: latesData,
            backgroundColor: '#f59e0b', // amber-500
            hoverBackgroundColor: '#d97706', // amber-600
            borderRadius: 6,
            barPercentage: 0.6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'top',
            align: 'end'
          }
        },
        scales: {
          y: { 
            beginAtZero: true,
            grid: {
              color: 'rgba(107, 114, 128, 0.1)' // grid line color
            },
            border: { display: false }
          },
          x: {
            grid: { display: false },
            border: { display: false }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    };
    this.weeklyChartInstance = new Chart(ctx, config);
  }

  createOfficeChart(users: any[]) {
    const ctx = this.officeChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const officeCounts: Record<string, number> = {};
    users.forEach(u => {
      const officeName = u.office?.name || 'Desconocido';
      officeCounts[officeName] = (officeCounts[officeName] || 0) + 1;
    });

    const labels = Object.keys(officeCounts);
    const data = Object.values(officeCounts);

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: labels.length > 0 ? labels : ['Sin datos'],
        datasets: [{
          data: data.length > 0 ? data : [1],
          backgroundColor: [
            '#3b82f6', // blue
            '#10b981', // green
            '#f59e0b', // yellow
            '#8b5cf6', // purple
            '#ef4444', // red
            '#6366f1',
            '#ec4899',
            '#14b8a6'
          ],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'right',
            labels: {
              padding: 20
            }
          }
        },
        cutout: '75%',
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1200,
          easing: 'easeOutBounce'
        }
      }
    };
    this.officeChartInstance = new Chart(ctx, config);
  }

  createRequestsChart(requests: any[]) {
    const ctx = this.requestsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Last 6 months requests
    const labels = [];
    const data = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      labels.push(d.toLocaleDateString('es-ES', { month: 'short' }).substring(0, 3));
      
      const reqs = requests.filter(r => {
        if (!r.createdAt) return false;
        const rd = new Date(r.createdAt);
        return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear() && r.status === 'Autorizado';
      });
      data.push(reqs.length);
    }

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Papeletas Aprobadas',
          data,
          borderColor: '#10b981', // emerald-500
          backgroundColor: 'rgba(16, 185, 129, 0.1)', // emerald-500 semi-transparent
          borderWidth: 3,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#10b981',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4 // Curva suave
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.parsed.y} aprobadas`;
              }
            }
          }
        },
        scales: {
          y: { 
            beginAtZero: true,
            grid: {
              color: 'rgba(107, 114, 128, 0.1)'
            },
            border: { display: false },
            ticks: {
              stepSize: 1
            }
          },
          x: {
            grid: { display: false },
            border: { display: false }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart'
        }
      }
    };
    this.requestsChartInstance = new Chart(ctx, config);
  }
}
