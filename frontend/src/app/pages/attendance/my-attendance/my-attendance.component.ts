import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';  // ← AGREGAR

@Component({
  selector: 'app-my-attendance',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],  // ← AGREGAR
  templateUrl: './my-attendance.component.html',
  styleUrls: ['./my-attendance.component.scss']
})
export class MyAttendanceComponent {
  currentMonth: string = 'abril';
  currentYear: number = 2026;

  entryTime: string = '08:01 AM';
  exitTime: string = '04:00 PM';

  days: string[] = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

  calendarDays: number[] = [30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
}
