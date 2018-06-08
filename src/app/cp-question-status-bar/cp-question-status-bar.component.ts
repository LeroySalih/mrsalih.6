import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Question } from '../models/question';
import { QuestionTypes } from '../enums/question-types';
import { QuestionStatus } from '../enums/question-status';

@Component({
  selector: 'app-cp-question-status-bar',
  templateUrl: './cp-question-status-bar.component.html',
  styleUrls: ['./cp-question-status-bar.component.css']
})
export class CpQuestionStatusBarComponent implements OnInit, OnChanges {

  @Input()
  questions: Question[];

  @Input()
  currentIndex: number;

  constructor() { }


  ngOnInit() {
   // console.log(`ngOnInit`, this.questions);
  }

  ngOnChanges(changes: SimpleChanges) {
   // console.log(`OnChanges`, changes);
  }

  checkStatus (question: Question): string {
    let classNames = '';

    if (question.order === this.currentIndex) {
      classNames = 'progressItem current ';
    } else {
      classNames = 'progressItem ';
    }
    switch (question.status) {
      case QuestionStatus.Unaswered: return classNames + 'unanswered';
      case QuestionStatus.Correct: return classNames + 'correct';
      case QuestionStatus.Incorrect: return classNames + 'incorrect';
      default: return classNames + 'unknown';
    }
  }

  getAccuracy(question: Question): string {
    const accuracy = question.calculateAccuracy();
    const retVal = (Number.isNaN(accuracy)) ? '--%' : accuracy + '%';
    return retVal;
  }


}
