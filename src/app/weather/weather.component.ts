import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  lat: number;
  lng: number;
  forecast: Observable<any>;

  constructor(private weather: WeatherService) { }

  ngOnInit() {
    this.forecast = this.weather.currentForecast()
     .do(data => console.log(data));
  }

  weatherIcon(icon) {
    switch (icon) {
      case 'partly-cloudy-day':
        return 'wi wi-day-cloudy';
      case 'clear-day':
        return 'wi wi-day-sunny';
      case 'partly-cloudy-night':
        return 'wi wi-night-partly-cloudy';
      default:
        return `wi wi-day-sunny`;
    }
  }
}
