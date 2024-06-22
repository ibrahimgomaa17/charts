import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChartBaseComponent } from './chart-base.component';
import { LineComponent } from './line/line.component';
import { LineSeriesComponent } from './line/line-series.component';

@NgModule({
  declarations: [
    AppComponent,
    LineComponent,
    ChartBaseComponent,
    LineSeriesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
