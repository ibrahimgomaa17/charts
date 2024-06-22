import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChartBaseComponent } from '../chart-base.component';
import { animate } from '@angular/animations';

@Component({
  selector: 'line-chart',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent extends ChartBaseComponent {
  categories: string[] = [];
  seriesList: PointSeries[] = []
  private allData: Set<any> = new Set();
  @Input('categories') set c(categories: string[]) {
    if (!categories?.length)
      return;
    this.categories = categories;
    setTimeout(() => {
      this.init(categories);
    }, 200);
  }
  refreshPoints(newData: [], oldData: []) {
    for (let index = 0; index < oldData.length; index++) {
      this.allData.delete(oldData[index]);
    }
    return this.registerSeries(newData);
  }
  // data2 = [746, 27, 310, 552, 220, 665]
  init(categories: any): void {
    // this.generatePoints(categories, this.data);
    let index = 0;
    this.registerControls(categories);
    let self = this;
    function animate() {
      requestAnimationFrame(animate);
      if (!self.context)
        return;
      self.context.globalCompositeOperation = 'destination-over';
      self.context.clearRect(0, 0, self.width, self.height)
      self.horizontalSection(self.context)
      self.verticalSection(self.categories, self.context);
      self.seriesList.forEach(x => {
        x.update(index, self.move, self.mouse);
      })
      // points.update(self.move, self.mouse);
      index++;
    }
    animate();
  }

  registerSeries(data: number[]) {
    if (!this.categories.length)
      return;
    if (this.width)
      this.canvas.nativeElement.width = this.width;
    if (this.height)
      this.canvas.nativeElement.height = this.height;
    this.context = this.canvas.nativeElement?.getContext('2d') as CanvasRenderingContext2D;

    this.width = this.canvas.nativeElement.width = this.canvas.nativeElement.clientWidth;
    this.height = this.canvas.nativeElement.height = this.canvas.nativeElement.clientHeight;
    this.context.canvas.width = this.width;
    this.context.canvas.height = this.height;
    const availableHeight = this.height - (this.topArea + this.bottomArea)
    const availableWidth = this.width - (this.leftArea + this.rightArea)

    this.categoryWidth = this.categoryPlot < (availableWidth / this.categories.length) ? (availableWidth / this.categories.length) : this.categoryPlot;

    this.allData = new Set([...this.allData, ...new Set(data)])
    let sortedData: any = Array.from(this.allData);
    sortedData.sort((a: number, b: number) => a - b);
    let stepFound = false;
    while (!stepFound) {
      if ((sortedData[sortedData.length - 1] / this.step) > 10)
        this.step *= 2;
      else stepFound = true;
    }

    this.steps = Math.ceil(sortedData[sortedData.length - 1] / this.step);
    this.stepHeight = availableHeight / this.steps
    let points: any = [];

    let startPoint = this.height - this.bottomArea;
    for (let index = 0; index < data.length; index++) {
      const yPoint = data[index] * availableHeight / (this.steps * this.step)
      points.push([(this.leftArea + (this.categoryWidth * index)) + this.categoryWidth / 2, startPoint - yPoint])
    }

    return points;
  }



}


export class PointSeries {
  private pointLines: PointLine[] = [];
  move: any;
  mouse: any;
  context: any;
  points: any;
  constructor(points: any, context: any) {
    this.points = points;
    this.context = context;
  }
  init(points?: any) {
    if (points?.length)
      this.points = points;
    for (let pointIndex = 0; pointIndex < this.points.length; pointIndex++) {
      let nextPoint = this.points[pointIndex + 1] ?? this.points[pointIndex];
      this.pointLines.push(new PointLine(this.points[pointIndex][0], this.points[pointIndex][1], nextPoint[0], nextPoint[1], this.context))

    }
  }



  update(ind: number, move: number, mouse: { x: number, y: number }) {
    for (let index = 0; index < this.points.length; index++) {
      if (index % ind >= index)
        this.pointLines[index].update(move, mouse)
    }
  }


}
class PointLine {
  x1: any;
  y1: any;
  x2: any;
  y2: any;
  r: any = 4;
  context: any;
  xMoved = 0;
  x2Moved = 0;
  constructor(px1: any, py1: any, px2 = null, py2 = null, context: any) {
    this.x1 = px1;
    this.y1 = py1;
    this.x2 = px2;
    this.y2 = py2;
    this.context = context;
    this.xMoved = this.x1;
    this.x2Moved = this.x2;
  }

  draw() {
    this.context.lineWidth = 1;
    this.context.beginPath();
    this.context.arc(this.xMoved, this.y1, this.r, 0, 2 * Math.PI);
    this.context.fill();
    this.context.closePath();
    this.context.beginPath();
    this.context.moveTo(this.xMoved, this.y1)
    this.context.lineTo(this.x2Moved, this.y2)
    this.context.fill();
    this.context.stroke()
    this.context.closePath();
  }
  update(move: number, mouse: { x: number, y: number }) {
    this.xMoved = this.x1 + move;
    this.x2Moved = this.x2 + move;
    this.r = 0;
    if (this.xMoved < mouse.x + 25 && this.xMoved > mouse.x - 25 && this.y1 < mouse.y + 25 && this.y1 > mouse.y - 25) {
      this.r = 4;
    }



    this.draw();
  }
}
