import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: [ './graph.component.css' ]
})

export class GraphComponent implements OnInit {
  status = 'red';
  name = 'Angular';
  r = 50;


  @Input() w;
  @Input() h;
  @Input() v;


  constructor() {}

  calc() {
    return this.v * this.w;
  }

  ngOnInit() {
    /*
    const timer = setInterval(() => {
      console.log(this.r);
      this.r -= 5;

      if (this.r <= 0){
        clearInterval(timer);
      }
    }, 100)
    */
  }

}