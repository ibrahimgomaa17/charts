import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'charts';
  categories= [
    "10-Jun",
    "11-Jun",
    "12-Jun",
    "14-Jun",
    "17-Jun",
    "20-Jun",
    "25-Jun",
    "27-Jun"
]
  data =[
    52441.93902239309,
    52845.71813463774,
    53072.95472261668,
    52998.65258600502,
    53050.5912655393,
    53267.27233565712,
    53586.87596967106,
    53978.06016424966
]
  changeData(data:any){
    let d = []
    let d2 = []
    for (let index = 0; index < data.length; index++) {
      d.push(Math.random() * 1000)
      d2.push(Math.random() * 3000)
    }

  }
}
