import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-quiz',
  templateUrl: './page-quiz.component.html',
  styleUrls: ['./page-quiz.component.css']
})
export class PageQuizComponent implements OnInit {

  equation: string;

  constructor() {
    this.equation = '\\frac{1}{2} \\div \\frac{1}{4}';
  }

  ngOnInit() {
  }

}
