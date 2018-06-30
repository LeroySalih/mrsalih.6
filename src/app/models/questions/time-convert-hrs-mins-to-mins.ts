import {QuestionTypes} from '../../enums/question-types';
import {QuestionStatus} from '../../enums/question-status';
import {Attempt} from '../attempt';
import {Question} from '../question';

import {sprintf } from 'sprintf-js';

export class TimeConvertHrsMinsToMins implements Question {
  public order;
  public answerLabel = '%1d minutes';
  public units = 'mins';
  public questionLabel = 'Convert \\space %1$d:%2$d \\space to \\space minutes';
  public inputParams: number[];
  public answers: any[];
  public type = QuestionTypes.TimeConvertHrsMinsToMins;
  public status = QuestionStatus.Unaswered;
  public attempts: Attempt[];

  constructor(question: Question = null) {
      if (question) {
          this.inputParams = question.inputParams;
          this.attempts = question.attempts;
          this.order = question.order;
          this.status = question.status;
          this.answers = question.answers;
      } else {
          this.inputParams = this.inputParamsFn();
          this.attempts = [];
          this.order = 0;
          this.status = QuestionStatus.Unaswered;
          this.answers = this.generateAnswers();
      }
  }

  toObject(): any {
      return {
          order: this.order,
          answerLabel: this.answerLabel,
          units: this.units,
          questionLabel: this.questionLabel,
          inputParams: this.inputParams
      };
  }

  generateAnswers(): any[] {

      const answers = [
          this.wrongAnswer(1),
          this.wrongAnswer(1),
          this.wrongAnswer(2),
          this.wrongAnswer(2),
      ];
      // console.log(`displayanswers:`, answers);

      const pos = Math.floor(Math.random() * 15) % 4;

      answers[pos] = this.correctAnswer();

      return answers;
  }

  getLabel(): string {
      return sprintf(this.questionLabel, ...this.inputParams);
  }

  getAnswers(): any {
      return null;
  }

  inputParamsFn(): number[] {
      return [
          Math.floor(Math.random() * 12),
          Math.floor(10 + (Math.random() * 49))
          ];
  }

  correctAnswer(): number {
      return (this.inputParams[0] * 60) + this.inputParams[1];
  }

  wrongAnswer(mode: number): number {

      switch (mode) {
          case 1: return (this.inputParams[1] * 60) + this.inputParams[0];
          case 2: return (Math.floor(Math.random() * 12) + Math.floor(10 + (Math.random() * 49)));
      }
  }

  public displayAnswers(): any[] {
      return this.answers;
  }

  checkAnswer(answer: string): boolean {
      return (this.correctAnswer() === parseInt(answer, 10));
  }

  addAttempt (attempt: Attempt): void {
      // insert the attempt at position 0
      this.attempts = [attempt, ...this.attempts];
  }

  calculateAccuracy (): number {

      let correct = 0;
      let incorrect = 0;

      this.attempts.forEach((attempt) => {

        if (attempt.status === QuestionStatus.Correct) {
          correct ++;
        } else {
          incorrect ++;
        }
      });

      if (correct + incorrect === 0) {
          return 0;
      } else {
          return Math.ceil((correct / (incorrect + correct) * 100)) ;
      }
    }
}
