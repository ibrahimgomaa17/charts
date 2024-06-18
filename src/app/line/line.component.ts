import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  data = [123, 276, 310, 212, 240, 156, 98]
  topArea = 50;
  bottomArea = 40;
  leftArea = 40;
  rightArea = 10;
  ngAfterViewInit(): void {
    const c = this.canvas.nativeElement?.getContext('2d') as CanvasRenderingContext2D;
    const width = this.canvas.nativeElement.width = this.canvas.nativeElement.clientWidth;
    const height = this.canvas.nativeElement.height = this.canvas.nativeElement.clientHeight;
    c.canvas.width = width;
    c.canvas.height = height;
    const availableHeight = height - (this.topArea + this.bottomArea)
    const availableWidth = width - (this.leftArea + this.rightArea)
    const categoryWidth = availableWidth / this.categories.length;
    c.lineWidth = .3
    for (let index = 0; index <= this.categories.length; index++) {
      c.beginPath();
      c.moveTo(this.leftArea + (categoryWidth * index), height - this.bottomArea)
      c.lineTo(this.leftArea + (categoryWidth * index), this.topArea);
      c.closePath();
      c.stroke()
      c.textAlign = "center"
      c.font = "14px Arial, Times, serif"

      c.fillText(this.categories[index], (this.leftArea + (categoryWidth * index)) + categoryWidth / 2, height - (this.bottomArea / 2))
      c.stroke()
    }
    let sortedData:any = JSON.parse(JSON.stringify(this.data)) 
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

    for (let index = 0; index <= steps; index++) {
      c.beginPath();
      c.moveTo(this.leftArea, (height - (this.bottomArea)) - (index * stepHeight))
      c.lineTo(width - this.rightArea, (height - this.bottomArea) - (index * stepHeight))
      c.closePath();
      c.stroke()
      c.textAlign = "center"
      c.textBaseline = "middle"
      c.font = "14px Arial, Times, serif"

      c.fillText((step * index).toString(), this.leftArea / 2, (height - this.bottomArea) - (index * stepHeight))
      c.stroke()
    }
    let points: any = [];

    let startPoint = height - this.bottomArea;
    for (let index = 0; index < this.data.length; index++) {
      const  yPoint = this.data[index] * availableHeight / (steps * step)
      c.fillRect((this.leftArea + (categoryWidth * index)) + categoryWidth / 2, startPoint - yPoint, 2, 2)
      points.push([(this.leftArea + (categoryWidth * index)) + categoryWidth / 2, startPoint - yPoint])
      c.fillStyle = "red"

    }




    const generatedPoints = points;
    console.log(generatedPoints);






    let index = -10;
    let self = this;
    function animate() {
      requestAnimationFrame(animate);
      if (index > generatedPoints.length * 10)
        return;
      // c.clearRect(10, 10, width - 20, height - 20)


      for (let ind = 0; ind < generatedPoints.length - 1; ind++) {
        if (ind * 4 <= index) {
          c.beginPath();
          c.moveTo(generatedPoints[ind][0], generatedPoints[ind][1])
          c.lineTo(generatedPoints[ind + 1][0], generatedPoints[ind + 1][1])
          c.stroke()
          c.closePath();
        }
      }

      c.strokeStyle = 'green'
      index++;




    }
    animate();

  }

}
