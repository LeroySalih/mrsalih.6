import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable ,  BehaviorSubject } from 'rxjs';

import { LessonProgress, LessonProgressId } from '../models/lesson-progress';
import {DbConfig} from '../db.config';

@Injectable()
export class LessonProgressService {

  collection: AngularFirestoreCollection<LessonProgress>;

  constructor(private afs: AngularFirestore) {
    // this.lessonsProgresses$ = new BehaviorSubject<LessonProgressId[]>(null);


  //  this.lessonProgresses$ = new BehaviorSubject<LessonProgress>(null);
  }

  setLessonProgress(lessonProgress: LessonProgress): Promise<void> {
    // this.collection = this.afs.collection<LessonProgress>('lessonProgress');
    return this.afs
    .doc(`lessonProgress/${lessonProgress.userId}-${lessonProgress.lessonId}-${lessonProgress.sectionId}`)
    .set(lessonProgress);

  }

  getProgressForUser(userId: string): Observable<LessonProgress[]> {
    console.log(`getProgressForUser ${userId}`);
    return this.afs.collection<LessonProgress>(DbConfig.LESSON_PROGRESS, ref => ref
        .where('userId', '==', userId))
        .valueChanges();
  }

  getLessonProgressForUser(userId: string, lessonId: string): Observable<LessonProgress[]> {

    return this.afs.collection<LessonProgress>(
      `lessonProgress`, ref => ref
              .where('lessonId', '==', lessonId)
              .where('userId', '==', userId)
    ).valueChanges();
  }
}

