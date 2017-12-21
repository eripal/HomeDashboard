import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WeatherService {
  readonly ROOT_URL = 'https://api.darksky.net/forecast/95a39d40c05db453030f8bc0cb84014e/59.1781,17.4278';

  constructor(private http: HttpClient) { }

  currentForecast(): Observable<any> {
    const httpParams = new HttpParams()
      .set('lang', 'sv')
      .set('units', 'si');
    return this.http.get(this.ROOT_URL, { params: httpParams });
  }
}
