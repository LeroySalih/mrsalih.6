import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import {sprintf } from 'sprintf-js';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { QuestionService } from '../services/question.service';
import { QuestionFactory, TimeConvertHrsMinsToMins } from '../models/question-factory';
import { Question } from '../models/question';
import { QuestionStatus } from '../enums/question-status';

export interface QuestionEvent {
  type: string;
  payload: any;
  sectionId?: string;
}

@Component({
  selector: 'app-cp-question',
  templateUrl: './cp-question.component.html',
  styleUrls: ['./cp-question.component.css']
})
export class CpQuestionComponent implements OnInit, OnChanges {

  @Input()
  question: Question;
  typedQuestion: Question;

  @Input()
  index: number;

  @Output()
  questionEvent: EventEmitter<QuestionEvent>;

  selectedAnswer = '';
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private questionService: QuestionService
  ) {

    // console.log(sprintf( question[0] as string, question[1], question [2]) );
    this.questionEvent = new EventEmitter<QuestionEvent>();

  }

  ngOnInit() {
    // console.log(`ngOnInit`, this.question);
    this.typedQuestion = QuestionFactory.createQuestionFromDB(this.question);

    this.form.valueChanges.subscribe((data) => {
    //  console.log(data);
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(`ngOnChanges`, changes);
    // update the display
    this.typedQuestion = QuestionFactory.createQuestionFromDB(this.question);

    let lastAttemptValue = '';

    if (this.typedQuestion.attempts.length > 0) {
      lastAttemptValue = this.typedQuestion.attempts[0].answer.toString();
      console.log(`[ngOnChanges] ${lastAttemptValue}`);
    }

    this.form = this.fb.group({
      answer: new FormControl({value: lastAttemptValue, disabled: this.checkAnswerDisable()})
    });
  }

  answerClicked(answer: any) {
    // console.log(`[answerClicked]`, answer);
    if (this.typedQuestion.status !== QuestionStatus.Correct) {
      this.checkAnswer();
    }

  }

  checkAnswer() {
    if (this.typedQuestion.checkAnswer(this.form.value['answer'])) {
      this.questionEvent.emit(
        {type: 'CORRECT_ANSWER',
        payload: {currentIndex: this.index, answer: parseFloat(this.form.value['answer'])}});
    } else {
      this.questionEvent.emit(
        {type: 'INCORRECT_ANSWER',
        payload: {currentIndex: this.index, answer: parseFloat(this.form.value['answer'])}});
    }

  }

  nextQuestion () {
    this.questionEvent.emit({type: 'NEXT_QUESTION', payload: null});
  }

  previousQuestion () {
    this.questionEvent.emit({type: 'PREVIOUS_QUESTION', payload: null});
  }

  checkAnswerDisable(): boolean {
    // console.log(`[checkQuestionDisable] Question ${this.question.order} status is ${this.question.status}`);
    // return true;
    return (this.question.status === QuestionStatus.Correct);
  }


}
