import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarUserComponent } from '../sidebar-user/sidebar-user.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarUserComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  userInfo: any = {};
  currentDate: Date = new Date();
  calendar: any[] = [];
  
  constructor(private authService: AuthService) {
    this.generateCalendar();
  }

  ngOnInit() {
    this.userInfo = this.authService.user.user;
  }

  get username() {
    return this.userInfo.username || 'Usuario';
  }
  get email() {
    return this.userInfo.email || 'usuario@email.com';
  }

  get currentMonthName(): string {
    return this.currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);
    
    // Día de la semana en que empieza el mes (0 = domingo)
    const firstDayOfWeek = firstDay.getDay();
    
    // Días del mes anterior para completar la primera semana
    const prevMonthDays = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      prevMonthDays.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Días del mes actual
    const currentMonthDays = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      currentMonthDays.push({
        day: i,
        isCurrentMonth: true,
        isToday: this.isToday(year, month, i)
      });
    }
    
    // Combinar los días y organizarlos en semanas
    const allDays = [...prevMonthDays, ...currentMonthDays];
    this.calendar = [];
    let week: any[] = [];
    
    allDays.forEach((day) => {
      week.push(day);
      if (week.length === 7) {
        this.calendar.push(week);
        week = [];
      }
    });
    
    // Si queda una semana incompleta, llenarla con días del siguiente mes
    if (week.length > 0) {
      let nextMonthDay = 1;
      while (week.length < 7) {
        week.push({
          day: nextMonthDay++,
          isCurrentMonth: false,
          isToday: false
        });
      }
      this.calendar.push(week);
    }
  }

  isToday(year: number, month: number, day: number): boolean {
    const today = new Date();
    return today.getDate() === day &&
           today.getMonth() === month &&
           today.getFullYear() === year;
  }
}