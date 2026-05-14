import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../../../core/services/users.service';
import { firstValueFrom } from 'rxjs';

interface BirthdayPerson {
  name: string;
  initials: string;
  dateFormatted: string;
  isToday: boolean;
  date: Date;
}

@Component({
  selector: 'app-dashboard-birthdays',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-birthdays.component.html',
  styleUrls: ['./dashboard-birthdays.component.scss']
})
export class DashboardBirthdaysComponent implements OnInit {
  currentMonthName: string = '';
  birthdays: BirthdayPerson[] = [];

  constructor(private usersService: UsersService) {}

  async ngOnInit() {
    const now = new Date();
    this.currentMonthName = now.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
    
    try {
      const users = await firstValueFrom(this.usersService.list());
      const currentMonth = now.getMonth();
      const currentDay = now.getDate();

      const monthBirthdays = (users || [])
        .filter((user: any) => user.birthDate)
        .map((user: any) => {
          // Parse robusto para fechas (YYYY-MM-DD o ISO)
          const dateObj = new Date(user.birthDate);
          let month, day;
          
          if (!isNaN(dateObj.getTime())) {
            // Es una fecha válida que se pudo parsear
            // Nota: las fechas YYYY-MM-DD parseadas con new Date() usan UTC por defecto, 
            // lo que puede restar un día según la zona horaria.
            // Para evitar esto, parseamos manualmente si viene en formato YYYY-MM-DD
            if (typeof user.birthDate === 'string' && user.birthDate.includes('-')) {
               const parts = user.birthDate.split('T')[0].split('-');
               if (parts.length === 3) {
                 month = parseInt(parts[1], 10) - 1; // 0-indexed
                 day = parseInt(parts[2], 10);
               } else {
                 month = dateObj.getMonth();
                 day = dateObj.getDate();
               }
            } else {
               month = dateObj.getMonth();
               day = dateObj.getDate();
            }
          } else {
            return null; // Fecha inválida
          }
          
          if (month !== currentMonth) return null;

          return {
            name: `${user.firstName} ${user.lastName}`,
            initials: `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`,
            dateFormatted: `${day} de ${this.currentMonthName.toLowerCase()}`,
            isToday: day === currentDay,
            date: new Date(now.getFullYear(), month, day)
          };
        })
        .filter((b: any) => b !== null);

      monthBirthdays.sort((a: any, b: any) => a.date.getDate() - b.date.getDate());
      this.birthdays = monthBirthdays as BirthdayPerson[];

    } catch (error) {
      console.error('Error loading birthdays', error);
    }
  }
}
