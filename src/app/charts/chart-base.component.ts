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
  @Input() title: string = '';
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() lineColor = "black";
  @Input() backgroundColor = "white";
  categoryPlot = 160;
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
  step: number = 5;
  stepHeight!: number;
  points: any = [];
  mouse: { x: number, y: number } = {
    x: 0,
    y: 0
  };



  verticalSection(categories: any, context: any) {
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
  horizontalSection(context: any) {
    context.lineWidth = .25;
    context.strokeStyle = this.lineColor;

    context.textAlign = "center"
    context.textBaseline = "middle"
    context.font = "16px Arial, Times, serif"
    context.fillStyle = this.lineColor;
    context.fillText( this.title,this.width /2, 25);
    context.fill();
    context.stroke()

    for (let index = 0; index <= this.steps; index++) {
      context.beginPath();
      context.moveTo(this.leftArea, (this.height - (this.bottomArea)) - (index * this.stepHeight))
      context.lineTo(this.width - this.rightArea, (this.height - this.bottomArea) - (index * this.stepHeight))
      context.closePath();
      context.stroke()
      context.textAlign = "center"
      context.textBaseline = "middle"
      context.font = "14px Arial, Times, serif"
      context.fillStyle = this.lineColor;
      context.fillText((this.step * index).toString(), this.leftArea / 2, (this.height - this.bottomArea) - (index * this.stepHeight))
      context.fill();
      context.stroke()
    }
    context.fillStyle = this.backgroundColor
    context.fillRect(0, 0, this.leftArea - 1, this.height);
    context.fill()

    context.fillStyle = this.lineColor;
    context.strokeStyle = this.lineColor;
    context.fill()
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
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;

      if (this.isHold) {
        if ((this.move <= 0 && e.clientX - this.start > 0) || ((Math.abs(this.move) + this.width > categories.length * this.categoryWidth) && e.clientX + Math.abs(this.move) < this.start))
          return
        this.move = e.clientX - this.start
      }

    })

  }

  registerData() {

  }
}
