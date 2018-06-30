import { Component, OnInit, Input } from '@angular/core';
import { LessonSection } from '../models/lesson-section';
import { QuestionService } from '../services/question.service';
import { Quiz } from '../models/quiz';
import { Question } from '../models/question';
import { QuestionStatus } from '../enums/question-status';
import { Attempt } from '../models/attempt';

import * as moment from 'moment';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-cp-section-quiz',
  templateUrl: './cp-section-quiz.component.html',
  styleUrls: ['./cp-section-quiz.component.css']
})
export class CpSectionQuizComponent implements OnInit {

  @Input()
  section: LessonSection;

  @Input()
  userId: string;

  quizes: Quiz[];
  questions: Question[];
  currentQuestionIndex: number;
  currentQuestion: Question;

  quizDates: Date[];

  constructor(private questionService: QuestionService,
              private messageService: MessageService
  ) {
    this.currentQuestionIndex = 0;
  }

  ngOnInit() {
    console.log(`[ngInout]`, this.section);

    this.questionService.getQuizzesForUser(
      this.section.lessonId,
      this.userId
    ).subscribe ((quizes) => {

      this.quizes = quizes;
      if (this.quizes && this.quizes.length) {

        // build the list of quiz dates
        this.quizDates = [];
        this.quizes.forEach((quiz) => {
          this.quizDates.push(quiz.timestamp);
        });

        this.questions = this.quizes[0].questions;
        this.currentQuestion = this.questions[this.currentQuestionIndex];

      } else {
        this.quizDates = [];
        this.questions = null;
        this.currentQuestion = null;
        this.currentQuestionIndex = 0;
      }

    } );
  }

  convertDate(date): string {
    // const dt = new Date(date);
    // console.log(`[convertDate]:: `, dt);
    // return dt.toDateString();
    // console.log(date.toDate());

    const quizDate = moment(date.toDate());
    const today = moment(new Date());

    if (Math.abs(quizDate.diff(today, 'days')) > 0) {
      return quizDate.toLocaleString();
    } else {
        return quizDate.fromNow();
    }
  }

  createQuiz() {
    console.log(`createQuiz`);
    this.questionService.createQuizforUser(
      this.section.lessonId,
      this.userId,
      this.section.options.quizTypeId)
      .then(() => { this.messageService.add({severity: 'success', summary: 'Quiz Created'}); })
      .catch((err) => {
        this.messageService.add({severity: 'danger', summary: err.message});
      });
  }

  onQuestionEvent(event) {
    console.log(`onQuestionEvent`, event);
    switch (event.type) {
      case 'CORRECT_ANSWER' : return this.correctQuestion(event.payload.answer);
      case 'INCORRECT_ANSWER' : return this.incorrectQuestion(event.payload.answer);
      case 'NEXT_QUESTION' : return this.nextQuestion();
      case 'PREVIOUS_QUESTION' : return this.previousQuestion();
      default: console.error('[onQuestionEvent] UNKNOWN EVENT TYPE');
    }
  }

  correctQuestion(answer: number) {
    this.questions[this.currentQuestionIndex].status = QuestionStatus.Correct;
    const attempt: Attempt = {status: QuestionStatus.Correct, answer };
    this.addAttemptToQuestions(attempt, this.questions[this.currentQuestionIndex]);

   // this.messageService.add({severity: 'success', summary: 'Correct!'});
   this.currentQuestionIndex = (this.currentQuestionIndex + 1) % 5;
   this.currentQuestion = this.questions[this.currentQuestionIndex];

   // save the questions
   this.questionService.saveQuizForUser(
     this.section.lessonId,
     this.userId,
     {questions: this.questions, timestamp: new Date()});
 }

 incorrectQuestion(answer: number) {

   // set the status to incorrect
   this.questions[this.currentQuestionIndex].status = QuestionStatus.Incorrect;

   const attempt: Attempt = {status: QuestionStatus.Incorrect, answer };
    this.addAttemptToQuestions(attempt, this.questions[this.currentQuestionIndex]);

   // save the questions status
   this.questionService.saveQuizForUser(
     this.section.lessonId,
     this.userId,
     {questions: this.questions, timestamp: new Date()});
 }

 nextQuestion() {
   this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.questions.length;
   this.currentQuestion = this.questions[this.currentQuestionIndex];
 }

 previousQuestion() {
   this.currentQuestionIndex = (this.currentQuestionIndex + 4) % this.questions.length;
   this.currentQuestion = this.questions[this.currentQuestionIndex];
 }

 addAttemptToQuestions(attempt: Attempt, question: Question): void {
  question.addAttempt(attempt);
 }

 onQuizChange(event) {
  console.log(`onQuizChange`, event);
  this.currentQuestionIndex = 0;
  this.questions = this.quizes[event.value].questions;
  this.currentQuestion = this.questions[this.currentQuestionIndex];
}

}
