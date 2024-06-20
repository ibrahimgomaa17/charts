import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chart-base',
  template: `
    <p>
      chart-base works!
    </p>
  `,
  styles: [
  ]
})
export class ChartBaseComponent {

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input() width: number = 0;
  @Input() height: number = 0;
  categoryPlot = 100;
  topArea = 50;
  bottomArea = 40;
  leftArea = 40;
  rightArea = 1;
  index = -10;
  isHold = false
  start = 0;
  move: number = 0;
  categoryWidth!: number;
  context!: CanvasRenderingContext2D
  steps!: number;
  step!:number;
  stepHeight!: number;
  points = [];

  generatePoints(categories: any, data: any) {
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

    this.categoryWidth = this.categoryPlot < (availableWidth / categories.length) ? (availableWidth / categories.length) : this.categoryPlot;


    this.context.lineWidth = .3
    let sortedData: any = JSON.parse(JSON.stringify(data))
    sortedData.sort((a: number, b: number) => a - b);
    let step = 5;
    let stepFound = false;
    while (!stepFound) {
      if ((sortedData[sortedData.length - 1] / step) > 10)
        step *= 2;
      else stepFound = true;
    }
    this.steps = Math.ceil(sortedData[sortedData.length - 1] / step);
    this.stepHeight = availableHeight / this.steps
    this.context.globalCompositeOperation = 'destination-over';
    let points: any = [];

    let startPoint = this.height - this.bottomArea;
    for (let index = 0; index < data.length; index++) {
      const yPoint = data[index] * availableHeight / (this.steps * step)
      points.push([(this.leftArea + (this.categoryWidth * index)) + this.categoryWidth / 2, startPoint - yPoint])
      // c.fillStyle = "red"
    }

    return points;

  }

  verticalSection(categories:any, context:any) {
    context.lineWidth = .25;
    for (let index = 0; index <= categories.length; index++) {
      context.beginPath();
      let value = this.move + this.leftArea + (this.categoryWidth * index)
      if (value < this.leftArea)
        value = this.leftArea
      if (value > this.width)
        value = this.width
      context.moveTo(value, this.height - this.bottomArea)
      context.lineTo(value, this.topArea);
      context.closePath();
      context.stroke()
      context.textAlign = "center"
      context.font = "14px Arial, Times, serif"

      context.fillText(categories[index], this.move + this.leftArea + (this.categoryWidth * index) + this.categoryWidth / 2, this.height - (this.bottomArea / 2))

      context.fill();
      context.stroke()
    }
  }
  horizontalSection(context:any) {
    context.lineWidth = .25;
    context.strokeStyle = 'black'
    for (let index = 0; index <= this.steps; index++) {
      context.beginPath();
      context.moveTo(this.leftArea, (this.height - (this.bottomArea)) - (index * this.stepHeight))
      context.lineTo(this.width - this.rightArea, (this.height - this.bottomArea) - (index * this.stepHeight))
      context.closePath();
      context.stroke()
      context.textAlign = "center"
      context.textBaseline = "middle"
      context.font = "14px Arial, Times, serif"

      context.fillText((this.step * index).toString(), this.leftArea / 2, (this.height - this.bottomArea) - (index * this.stepHeight))
      context.stroke()
    }
    context.fillStyle = 'white'
    context.fillRect(0, 0, this.leftArea - 1, this.height);
    context.fill()

    context.fillStyle = 'black'
    context.strokeStyle = 'black'

  }


  registerControls(categories: any) {

    // mobile controls
    this.canvas.nativeElement.addEventListener('touchmove', e => {
      e.preventDefault()
      if (this.isHold) {
        if ((this.move <= 0 && e.changedTouches[0].screenX - this.start > 0) || ((Math.abs(this.move) + this.width >= categories.length * this.categoryWidth) && e.changedTouches[0].screenX + Math.abs(this.move) < this.start))
          return
        this.move = e.changedTouches[0].screenX - this.start
      }

    })
    this.canvas.nativeElement.addEventListener('touchstart', e => {
      this.isHold = true
      this.start = e.changedTouches[0].screenX - this.move;
    })
    this.canvas.nativeElement.addEventListener('touchend', e => {
      this.isHold = false
    })



    // browser controls
    this.canvas.nativeElement.addEventListener('mousedown', e => {
      this.isHold = true
      this.start = e.clientX - this.move;
      this.canvas.nativeElement.classList.add('moveClass');
    })

    this.canvas.nativeElement.addEventListener('mouseup', e => {
      this.isHold = false;
      this.canvas.nativeElement.classList.remove('moveClass');

    })
    this.canvas.nativeElement.addEventListener('mousemove', e => {
      if (this.isHold) {
        if ((this.move <= 0 && e.clientX - this.start > 0) || ((Math.abs(this.move) + this.width > categories.length * this.categoryWidth) && e.clientX + Math.abs(this.move) < this.start))
          return
        this.move = e.clientX - this.start
      }

    })

  }
}
