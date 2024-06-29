import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LineSeriesComponent } from './charts/line/line-series.component';
import { LineComponent } from './charts/line/line.component';

@NgModule({
  declarations: [
    AppComponent,
    LineSeriesComponent,
    LineComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
