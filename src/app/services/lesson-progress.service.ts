import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable ,  BehaviorSubject } from 'rxjs';

import { LessonProgress, LessonProgressId } from '../models/lesson-progress';

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

  getLessonProgressForUser(userId: string, lessonId: string): Observable<LessonProgress[]> {

    return this.afs.collection<LessonProgress>(
      `lessonProgress`, ref => ref
              .where('lessonId', '==', lessonId)
              .where('userId', '==', userId)
    ).valueChanges();
  }
}

