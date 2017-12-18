import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ClockComponent } from './clock/clock.component';
import { TrainComponent } from './train/train.component';
import { NewsComponent } from './news/news.component';


@NgModule({
  declarations: [
    AppComponent,
    ClockComponent,
    TrainComponent,
    NewsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
