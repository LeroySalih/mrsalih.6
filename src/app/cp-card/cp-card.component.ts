import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-cp-card',
  templateUrl: './cp-card.component.html',
  styleUrls: ['./cp-card.component.css']
})
export class CpCardComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  subTitle: string;

  @Input()
  tag: string;

  @Input()
  thumbnailUrl: string;

  @Input()
  date: Date;

  @Input()
  linkUrl: string[];

  constructor() { }

  ngOnInit() {
    console.log(this);
  }

  convertDate(date): string {
    // const dt = new Date(date);
    // console.log(`[convertDate]:: `, dt);
    // return dt.toDateString();
    // console.log(date.toDate());

    if (date === undefined) {
      return '';
    }

    const quizDate = moment(date.toDate());
    const today = moment(new Date());

    if (Math.abs(quizDate.diff(today, 'days')) > 0) {
      return moment(date.toDate()).format('Do MMM YYYY');
    } else {
        return quizDate.fromNow();
    }
  }

}
