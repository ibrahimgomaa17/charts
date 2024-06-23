import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LineComponent } from './charts/line/line.component';
import { LineSeriesComponent } from './charts/line/line-series.component';
import { ChartBaseComponent } from './charts/chart-base.component';

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
