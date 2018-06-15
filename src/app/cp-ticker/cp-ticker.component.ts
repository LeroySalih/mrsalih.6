import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { trigger, state, style, animate, transition} from '@angular/animations';


@Component({
  selector: 'app-cp-ticker',
  templateUrl: './cp-ticker.component.html',
  styleUrls: ['./cp-ticker.component.css'],
  animations: [
    trigger('newsItemTrigger', [

      state('in', style(
        {
          transform: 'translate(0, -75%)',
          opacity: 1
        })),
      transition ('void => in', [
          style({
            transform: 'translate(-50%, -75%)',
            opacity: 0
          }),
          animate ('1000ms')
          ]),

      transition ('in => void', [
        animate ('1000ms', style ({ transform: 'translate(50%, -75%)', opacity: 0}))
        ]),
    ])
  ]
})

export class CpTickerComponent implements OnInit {

  newsItem: string;
  newsItems: string[];
  tickerTimer: Subscription;
  tickerState = false;
  tickerItems: string[];

  constructor() {
    this.newsItem = null;
    this.tickerItems = ['Item 1', 'Item 2', 'Item 3'];
  }

  ngOnInit() {
    this.tickerTimer = timer(1000, 2000)
        .subscribe ((val) => {
         this.tickerState = !this.tickerState;
           if (this.tickerState) {
            this.newsItem = this.tickerItems[(val / 2) % 3];
           }
        });
  }
  animationDone(event) {
    // console.log(event);
  }

}
