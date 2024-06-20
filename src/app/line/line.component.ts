import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChartBaseComponent } from '../chart-base.component';
import { animate } from '@angular/animations';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent extends ChartBaseComponent implements AfterViewInit {

  categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  data = [123, 276, 310, 212, 240, 156, 98, 123, 276, 310, 212, 240, 156, 98]
  ngAfterViewInit(): void {
    this.generatePoints(this.categories, this.data);
    this.registerControls(this.categories);
    let self = this;
   function animate() {
      requestAnimationFrame(animate);
      // if (index > generatedPoints.length * 5)
      //   return;
      self.context.clearRect(0, 0, self.width, self.height)
      //  y axis
      self.horizontalSection(self.context)
      // x-axis categories
      self.verticalSection(self.categories, self.context);
      self.context.lineWidth = 1;
      let arcValue = 3;
      for (let ind = 0; ind < self.points.length - 1; ind++) {
  
        if (ind * 2 <= self.index) {
          if (ind == 0) {
            self.context.beginPath();
            self.context.arc(self.move + self.points[0][0], self.points[0][1], arcValue, 0, 2 * Math.PI);
            self.context.fill();
            self.context.closePath()
          }
          self.context.beginPath();
          self.context.arc(self.move + self.points[ind + 1][0], self.points[ind + 1][1], arcValue, 0, 2 * Math.PI);
          self.context.moveTo(self.move + self.points[ind][0], self.points[ind][1])
          self.context.lineTo(self.move + self.points[ind + 1][0], self.points[ind + 1][1])
          self.context.fill();
          self.context.stroke()
          self.context.closePath();
        }
      }
  
      // self.context.strokeStyle = 'green'
      self.index++;
  
  
  
  
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
