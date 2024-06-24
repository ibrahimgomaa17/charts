import { Component, Input } from '@angular/core';
import { LineComponent, PointSeries } from './line.component';
import { auditTime, debounce, debounceTime, filter, throttleTime } from 'rxjs';

@Component({
  selector: 'line-chart-series',
  template: `
    <p>
      line-series works!
    </p>
  `,
  styles: [
  ]
})
export class LineSeriesComponent {
  private series!: PointSeries;
  private seriesData!: [];
  @Input() title:string = ''
  @Input('data') set d(data: any) {
    if (!data?.length)
      return;
    if (!this.series) {
      setTimeout(() => {
        let points = this.linecomponent.registerSeries(data)
        this.series = new PointSeries(points, this.linecomponent.context, this.linecomponent.colors[this.linecomponent.seriesList.length], this.title);
        this.series.init();

        this.linecomponent.seriesList.push(this.series);
      }, 200);
      this.seriesData = data;
    }
    else {
      this.plotSeries(data);
    }
  };
  constructor(private linecomponent: LineComponent) {
    linecomponent.zoom$.pipe(auditTime(10),filter(x=> x != null)).subscribe(x=>{
      this.plotSeries(this.seriesData, x)
    })
  }

  private plotSeries(data: any, zoom?:any) {
    const points = this.linecomponent.refreshPoints(data, this.seriesData, zoom);
    const seriesIndex = this.linecomponent.seriesList.indexOf(this.series);
    this.linecomponent.seriesList[seriesIndex].init(points);
    this.series = this.linecomponent.seriesList[seriesIndex];
  }
}





