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
  private endDate: Date = new Date('2023-12-15T23:59:59');
  isOfferActive: boolean = true;

  ngOnInit() {
    if (new Date().getTime() > this.endDate.getTime()) {
      this.isOfferActive = false;
      return;
    }
    
    this.timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = this.endDate.getTime() - now;
      
      if (distance > 0) {
        this.timeLeft.days = Math.floor(distance / (1000 * 60 * 60 * 24));
        this.timeLeft.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.timeLeft.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        this.timeLeft.seconds = Math.floor((distance % (1000 * 60)) / 1000);
      } else {
        this.timeLeft = {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
        this.isOfferActive = false;
        clearInterval(this.timer);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
