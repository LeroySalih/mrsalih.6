
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {sprintf } from 'sprintf-js';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Question } from '../models/question';

import { Observable } from 'rxjs';
import { DbConfig } from '../db.config';
import { QuestionFactory } from '../models/question-factory';
import { QuestionSpec } from '../models/question-spec';

import { Quiz } from '../models/quiz';
import { QuestionTypes } from '../enums/question-types';



@Injectable()
export class QuestionService {


  constructor(private afs: AngularFirestore) {

   }


  createQuizforUser(lessonId: string, userId: string, questionType: QuestionTypes): Promise<void> {

    console.log(`createQuizforUser lessonId:  ${lessonId}` );
    // const quiz: AngularFirestoreDocument<Quiz> = this.afs.doc(`${DbConfig.QUIZ}/${lessonId}`);

    return new Promise ((reject, resolve) => {

        // create 5 questions
        const questions: Question[] = QuestionFactory.createQuestions(QuestionTypes.TimeConvertHrsMinsToMins, 5);
        const quiz: Quiz = {questions};

        // save them to DB
        const saveQuestions = questions.map((question) => {
          return Object.assign({}, question);
        });

        const saveObj = Object.assign({}, {questions: saveQuestions});

        return this.afs.doc(`${DbConfig.QUIZ}/${lessonId}/userId/${userId}`).set(saveObj);

      });

  }

  getQuizForUser (lessonId: string, userId): Observable<Quiz> {
    const doc: AngularFirestoreDocument<Quiz> = this.afs.doc(`${DbConfig.QUIZ}/${lessonId}/userId/${userId}`);
    return doc.valueChanges().pipe(map((quiz) => {

      if (quiz && quiz.questions) {
        // Ensure that the questions are of the correct type.
        quiz.questions = quiz.questions.map((obj) => {
          return QuestionFactory.createQuestionFromDB(obj); }
        );
      }

      return quiz;
    }));
  }

  saveQuizForUser(lessonId: string, userId: string, questions: Question[]): Promise<void> {

    // save them to DB
    const saveQuestions = questions.map((question) => {
      return Object.assign({}, question);
    });

    const saveObj = Object.assign({}, {questions: saveQuestions});

    return this.afs.doc(`${DbConfig.QUIZ}/${lessonId}/userId/${userId}`).set(saveObj);
  }

}
