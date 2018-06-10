
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

import * as firebase from 'firebase';

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

        // convert the questions to POJO
        const saveQuestions = questions.map((question) => {
          return Object.assign({}, question );
        });


        // construct a quiz object
        const saveObj = Object.assign({}, {
            questions: saveQuestions,
            timestamp: new Date()
          });

        // add the quiz to the qizzes collection
        return this.afs.doc(`${DbConfig.QUIZ}/${lessonId}/userId/${userId}/quizzes/${saveObj.timestamp}`).set(saveObj);

      });

  }

  convertQuestionsToTypedQuestions(questions: Question[]): Question[] {
    return  questions.map((question) => {
      return QuestionFactory.createQuestionFromDB(question);
    });
  }

  getQuizzesForUser (lessonId: string, userId: string): Observable<Quiz[]> {

    const collection: AngularFirestoreCollection<Quiz> = this.afs.collection<Quiz>(`${DbConfig.QUIZ}/${lessonId}/userId/${userId}/quizzes`);

    return collection.valueChanges().pipe(map((quizzes) => {

      return quizzes.map((quiz) => {
        quiz.questions = this.convertQuestionsToTypedQuestions(quiz.questions);
        return quiz;
      });
    }));
  }

  getQuizForUser (lessonId: string, userId): Observable<Quiz[]> {
    const doc: AngularFirestoreDocument<Quiz> = this.afs.doc(`${DbConfig.QUIZ}/${lessonId}/userId/${userId}`);
    const collection: AngularFirestoreCollection<Quiz> = this.afs.collection<Quiz>
          (DbConfig.QUIZ, ref => ref
              .where('lessonId', '==', lessonId)
              .where('userId', '==', userId)
              .orderBy('lessonId.userId.timestamp', 'asc'));

    return collection.valueChanges().pipe(map((quizzes: Quiz[]) => {

      quizzes.forEach((quiz) => {
        quiz.questions = quiz.questions.map((obj) => {
          return QuestionFactory.createQuestionFromDB(obj); }
        );
      });

      return quizzes;
    }));
  }

  saveQuizForUser(lessonId: string, userId: string, quiz: Quiz): Promise<void> {

    // save them to DB
    const saveQuestions = quiz.questions.map((question) => {
      return Object.assign({}, question);
    });

    const saveObj = Object.assign({}, {questions: saveQuestions, timestamp: quiz.timestamp});

    return this.afs.doc(`${DbConfig.QUIZ}/${lessonId}/userId/${userId}/quiz/${quiz.timestamp}`).set(saveObj);
  }

}
