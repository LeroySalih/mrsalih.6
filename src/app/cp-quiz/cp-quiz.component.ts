import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Question } from '../models/question';
import { QuestionEvent } from '../cp-question/cp-question.component';

@Component({
  selector: 'app-cp-quiz',
  templateUrl: './cp-quiz.component.html',
  styleUrls: ['./cp-quiz.component.css']
})
export class CpQuizComponent implements OnInit {

  @Input()
  questions: Question[];

  @Input()
  currentQuestion: Question;

  @Input()
  currentQuestionIndex: number;

  @Output()
  questionEvent: EventEmitter<QuestionEvent>;

  constructor() {

    this.questionEvent = new EventEmitter<QuestionEvent>();
  }

  ngOnInit() {
  }

  onQuestionEvent(event: QuestionEvent) {
    this.questionEvent.emit(event);
  }


}
