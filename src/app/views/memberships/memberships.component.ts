import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-memberships',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './memberships.component.html',
  styleUrls: ['./memberships.component.css']
})
export class MembershipsComponent implements OnInit, OnDestroy {
  timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  private timer: any;

  ngOnInit() {
    // Establecer la fecha final (7 días desde ahora)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    
    this.timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;
      
      this.timeLeft.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.timeLeft.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.timeLeft.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.timeLeft.seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      if (distance < 0) {
        clearInterval(this.timer);
        // Reiniciar el contador o mostrar mensaje
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
