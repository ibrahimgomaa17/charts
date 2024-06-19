import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input() width: number = 0;
  @Input() height: number = 0;
  categoryPlot = 100;
  categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  data = [123, 276, 310, 212, 240, 156, 98, 123, 276, 310, 212, 240, 156, 98]
  topArea = 50;
  bottomArea = 40;
  leftArea = 40;
  rightArea = 1;
  ngAfterViewInit(): void {
    const c = this.canvas.nativeElement?.getContext('2d') as CanvasRenderingContext2D;
    if (this.width)
      this.canvas.nativeElement.width = this.width;
    if (this.height)
      this.canvas.nativeElement.height = this.height;

    const width = this.canvas.nativeElement.width = this.canvas.nativeElement.clientWidth;
    const height = this.canvas.nativeElement.height = this.canvas.nativeElement.clientHeight;
    c.canvas.width = width;
    c.canvas.height = height;
    const availableHeight = height - (this.topArea + this.bottomArea)
    const availableWidth = width - (this.leftArea + this.rightArea)
    const categoryWidth = this.categoryPlot < (availableWidth / this.categories.length)?(availableWidth / this.categories.length): this.categoryPlot;
    c.lineWidth = .3
    let sortedData: any = JSON.parse(JSON.stringify(this.data))
    sortedData.sort((a: number, b: number) => a - b);
    let step = 5;
    let stepFound = false;
    while (!stepFound) {
      if ((sortedData[sortedData.length - 1] / step) > 10)
        step *= 2;
      else stepFound = true;
    }
    const steps = Math.ceil(sortedData[sortedData.length - 1] / step);
    const stepHeight = availableHeight / steps
    let move: number = 0;
    let isHold = false
    let start = 0;


    // mobile controls
    this.canvas.nativeElement.addEventListener('touchmove', e => {
      e.preventDefault()
      if (isHold) {
        if ((move <= 0 && e.changedTouches[0].screenX - start > 0) || ((Math.abs(move) + width >= this.categories.length * categoryWidth) && e.changedTouches[0].screenX + Math.abs(move) < start))
          return
        move = e.changedTouches[0].screenX - start
      }

    })
    this.canvas.nativeElement.addEventListener('touchstart', e => {
      isHold = true
      start = e.changedTouches[0].screenX - move;
    })
    this.canvas.nativeElement.addEventListener('touchend', e => {
      isHold = false
    })



    // browser controls
    this.canvas.nativeElement.addEventListener('mousedown', e => {
      isHold = true
      start = e.clientX - move;
    })

    this.canvas.nativeElement.addEventListener('mouseup', e => {
      isHold = false
    })
    this.canvas.nativeElement.addEventListener('mousemove', e => {
      if (isHold) {
        if ((move <= 0 && e.clientX - start > 0) || ((Math.abs(move) + width >= this.categories.length * categoryWidth) && e.clientX + Math.abs(move) < start))
          return
        move = e.clientX - start
      }

    })


    let points: any = [];

    let startPoint = height - this.bottomArea;
    for (let index = 0; index < this.data.length; index++) {
      const yPoint = this.data[index] * availableHeight / (steps * step)

      points.push([(this.leftArea + (categoryWidth * index)) + categoryWidth / 2, startPoint - yPoint])
      // c.fillStyle = "red"
    }




    const generatedPoints = points;
    console.log(generatedPoints);




    c.globalCompositeOperation = 'destination-over';

    let index = -10;
    let self = this;



    function animate() {
      requestAnimationFrame(animate);
      // if (index > generatedPoints.length * 5)
      //   return;
      c.clearRect(0, 0, width, height)

      c.lineWidth = .25;


      //  y axis
      for (let index = 0; index <= steps; index++) {
        c.beginPath();
        c.moveTo(self.leftArea, (height - (self.bottomArea)) - (index * stepHeight))
        c.lineTo(width - self.rightArea, (height - self.bottomArea) - (index * stepHeight))
        c.closePath();
        c.stroke()
        c.textAlign = "center"
        c.textBaseline = "middle"
        c.font = "14px Arial, Times, serif"

        c.fillText((step * index).toString(), self.leftArea / 2, (height - self.bottomArea) - (index * stepHeight))
        c.stroke()
      }
      c.fillStyle = 'white'
      c.fillRect(0, 0, self.leftArea - 1, height);
      c.fill()

      // x-axis categories
      for (let index = 0; index <= self.categories.length; index++) {
        c.beginPath();
        let value = move + self.leftArea + (categoryWidth * index)
        if (value < self.leftArea)
          value = self.leftArea
        if (value > width)
          value = width
        c.moveTo(value, height - self.bottomArea)
        c.lineTo(value, self.topArea);
        c.closePath();
        c.stroke()
        c.textAlign = "center"
        c.font = "14px Arial, Times, serif"

        c.fillText(self.categories[index], move + self.leftArea + (categoryWidth * index) + categoryWidth / 2, height - (self.bottomArea / 2))
        c.fillStyle = 'black'
        c.fill();
        c.stroke()
      }




      c.lineWidth = 1;
      for (let ind = 0; ind < generatedPoints.length - 1; ind++) {
        if (ind * 2 <= index) {
          c.beginPath();
          c.fill();
          c.arc(move + generatedPoints[ind + 1][0], generatedPoints[ind + 1][1], 4, 0, 2 * Math.PI);
          c.moveTo(move + generatedPoints[ind][0], generatedPoints[ind][1])
          c.lineTo(move + generatedPoints[ind + 1][0], generatedPoints[ind + 1][1])
          c.fillStyle = "black";
          c.fill();
          c.stroke()
          c.closePath();
        }
      }

      // c.strokeStyle = 'green'
      index++;




    }
    animate();

  }


  dataSet = [
    {
      "Category": 1716336000000,
      "value": 50541.4198,
      "change": 1.11
    },
    {
      "Category": 1716422400000,
      "value": 50841.160121420005,
      "change": -1.71
    },
    {
      "Category": 1716508800000,
      "value": 50241.56594619709,
      "change": 0.64
    },
    {
      "Category": 1716854400000,
      "value": 50541.05417403104,
      "change": -1.55
    },
    {
      "Category": 1716940800000,
      "value": 51241.583549961,
      "change": 6.97
    },
    {
      "Category": 1717027200000,
      "value": 51141.18984017626,
      "change": -0.67
    },
    {
      "Category": 1717113600000,
      "value": 51441.74610595251,
      "change": 0.14
    },
    {
      "Category": 1717372800000,
      "value": 51641.77709115405,
      "change": -2.83
    },
    {
      "Category": 1717459200000,
      "value": 51841.636448139325,
      "change": 1.41
    },
    {
      "Category": 1717545600000,
      "value": 51541.12304655912,
      "change": -1.87
    },
    {
      "Category": 1717632000000,
      "value": 51841.55500944779,
      "change": 0.62
    },
    {
      "Category": 1717718400000,
      "value": 52541.18096150825,
      "change": 0.64
    },
    {
      "Category": 1717977600000,
      "value": 52441.93902239309,
      "change": -0.74
    },
    {
      "Category": 1718064000000,
      "value": 52845.71813463774,
      "change": -2.48
    },
    {
      "Category": 1718150400000,
      "value": 53072.95472261668,
      "change": 0.43
    },
    {
      "Category": 1718323200000,
      "value": 52998.65258600502,
      "change": -0.14
    },
    {
      "Category": 1718582400000,
      "value": 53050.5912655393,
      "change": 0.5
    }
  ]

}
