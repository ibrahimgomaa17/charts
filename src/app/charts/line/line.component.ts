import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { animate } from '@angular/animations';
import { ChartBaseComponent } from '../chart-base.component';

@Component({
  selector: 'line-chart',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent extends ChartBaseComponent {
  colors = ['red', 'blue', 'green', 'orange', 'purple', 'red', 'teal', 'yellow'];


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
  refreshPoints(newData: [], oldData: [], zoom?: any) {
    if (!zoom && zoom != 0)
      for (let index = 0; index < oldData.length; index++) {
        this.allData.delete(oldData[index]);
      }
    return this.registerSeries(newData, zoom);
  }
  // data2 = [746, 27, 310, 552, 220, 665]
  init(categories: any): void {
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
    this.availableHeight = this.height - (this.topArea + this.bottomArea)
    this.availableWidth = this.width - (this.leftArea + this.rightArea)

    this.categoryWidth = this.categoryPlot < (this.availableWidth / this.categories.length) ? (this.availableWidth / this.categories.length) : this.categoryPlot;


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
      index++;
    }
    animate();
  }

  registerSeries(data: number[], zoom?: number) {
    if (zoom) {
      if (zoom > 0) {
        if (this.categoryWidth < this.availableWidth / 3)
          this.categoryWidth++;
      }
      else {
        if (this.categoryWidth * this.categories.length > this.availableWidth) {
          if (this.categoryWidth * this.categories.length + this.move > this.availableWidth)
            this.categoryWidth--;
          if (this.move < 0)
            this.move ++;;
          console.log(this.move);


        }
      }
    }
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
    this.stepHeight = this.availableHeight / this.steps
    let points: any = [];

    let startPoint = this.height - this.bottomArea;
    for (let index = 0; index < data.length; index++) {
      const yPoint = data[index] * this.availableHeight / (this.steps * this.step)
      points.push([(this.leftArea + (this.categoryWidth * index)) + this.categoryWidth / 2, startPoint - yPoint, data[index]])
    }

    return points;
  }

}


export class PointSeries {
  move: any;
  mouse: any;
  context: any;
  points: any;
  name: string = '';
  private pointLines: PointLine[] = [];
  color: any;
  constructor(points: any, context: any, color: any, name: string) {
    this.points = points;
    this.context = context;
    this.color = color;
    this.name = name
  }
  init(points?: any) {
    if (points?.length) {
      this.points = points;
      this.pointLines = [];
    }
    for (let pointIndex = 0; pointIndex < this.points.length; pointIndex++) {
      let nextPoint = this.points[pointIndex + 1] ?? this.points[pointIndex];
      this.pointLines.push(new PointLine(this.points[pointIndex][0], this.points[pointIndex][1], nextPoint[0], nextPoint[1], this.context, this.name, this.points[pointIndex][2]))

    }
  }



  update(ind: number, move: number, mouse: { x: number, y: number }) {
    this.context.fillStyle = this.color;
    this.context.strokeStyle = this.color;
    for (let index = 0; index < this.points.length; index++) {
      if (index % ind >= index)
        this.pointLines[index].update(move, mouse, this.color)
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
  name: string = '';
  value: any;
  constructor(px1: any, py1: any, px2 = null, py2 = null, context: any, name: string, value: any) {
    this.x1 = px1;
    this.y1 = py1;
    this.x2 = px2;
    this.y2 = py2;
    this.context = context;
    this.xMoved = this.x1;
    this.x2Moved = this.x2;
    this.name = name;
    this.value = value;
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
  update(move: number, mouse: { x: number, y: number }, color: any) {
    this.xMoved = this.x1 + move;
    this.x2Moved = this.x2 + move;
    this.r = 0;
    if (this.xMoved < mouse.x + 25 && this.xMoved > mouse.x - 25 && this.y1 < mouse.y + 25 && this.y1 > mouse.y - 25) {
      this.r = 4;
      this.context.fillStyle = 'white'
      this.context.textAlign = "center"
      this.context.textBaseline = "middle"
      this.context.font = "10px Arial, Times, serif"
      // this.context.fillStyle = this.lineColor;
      this.context.fillText(this.name + ' - ' + this.value, this.xMoved, this.y1 - 20);
      this.context.fill()
      const dimension = this.context.measureText(this.name + ' - ' + this.value)
      this.context.fillStyle = color
      this.context.fillRect(this.xMoved - (dimension.width + 20) / 2, this.y1 - 30, dimension.width + 20, 20);
      this.context.fill();
      this.context.stroke()

    }



    this.draw();
  }
}
