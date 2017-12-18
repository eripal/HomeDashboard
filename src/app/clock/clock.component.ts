import { Component, OnInit, OnDestroy } from '@angular/core';
import { setInterval } from 'timers';


@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit {
  clock: Date;

  constructor() {}

  ngOnInit() {
    this.getDate();
  }

  getDate(): void {
   setInterval(() => {
     this.clock = new Date();
   }, 1000);
  }
}

