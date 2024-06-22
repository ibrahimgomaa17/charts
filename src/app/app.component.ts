import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'charts';
  data1 = [123, 276, 310, 212, 240, 156];
  data2 = [444, 124, 344, 111, 2345, 1536]

  changeData(data:any){
    let d = []
    for (let index = 0; index < data.length; index++) {
      d.push(Math.random() * 1000)
    }
this.data1 = d;
  }
}
