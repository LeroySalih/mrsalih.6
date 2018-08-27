import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction } from 'angularfire2/firestore';
import { Observable ,  BehaviorSubject } from 'rxjs';

import { Lesson } from '../models/lesson';

import { v4 as uuid } from 'uuid';
import { DbConfig } from '../db.config';

@Injectable()
export class LessonService {

  constructor(private afs: AngularFirestore) {

  }

  getAllLessons(): Observable<Lesson[]> {
    return this.afs.collection<Lesson>(DbConfig.LESSONS).valueChanges();
  }

  getLessons(moduleId: string): Observable<Lesson[]> {

    // console.log(`[getLessons]`, moduleId);

    const collection = this.afs.collection<Lesson>(DbConfig.LESSONS, ref => ref.where('moduleId', '==', moduleId).orderBy('order', 'asc'));

    return collection.valueChanges();

  }

  getLesson(lessonId: string): Observable<Lesson> {

    // console.log(`[getLesson] subscribing to `, lessonId);

    const document: AngularFirestoreDocument<Lesson> = this.afs.doc(`${DbConfig.LESSONS}/${lessonId}`);
    return document.valueChanges();

  }

  saveLesson (lesson: Lesson): Promise<void> {
    // console.log(`[saveLesson]`, lesson);

    if (lesson.id === undefined || lesson.id === null) {
      console.log(`Lesson Id is undefined, creating new`);
      lesson.id = uuid();
    }
    return this.afs.doc(`${DbConfig.LESSONS}/${lesson.id}`).set(lesson);
  }

  bulkUpdate(lessons: Lesson[]) {

    // console.log(`[bulkUpdate]`, lessons);
    const batch = this.afs.firestore.batch();

    lessons.forEach((l) => {
        const docRef = this.afs.firestore.doc(`${DbConfig.LESSONS}/${l.id}`);
        batch.set(docRef, l);
    });

    return batch.commit();
  }


  deleteLesson (lesson: Lesson): Promise<void> {
    return this.afs.doc(`${DbConfig.LESSONS}/${lesson.id}`).delete();
  }

  swapLessonOrder(lesson: Lesson, swapLesson: Lesson): Promise<void> {

    if (lesson === undefined || swapLesson === undefined)  {
      return Promise.reject(new Error('Invalid paramters'));
    }

    // console.log(`[demoteLesson]`, [lesson, swapLesson] );

    const batch = this.afs.firestore.batch();

    const lessonRef = this.afs.firestore.doc(`${DbConfig.LESSONS}/${lesson.id}`);
    const swapRef = this.afs.firestore.doc(`${DbConfig.LESSONS}/${swapLesson.id}`);

    const tmp = swapLesson.order;
    swapLesson.order = lesson.order;
    lesson.order = tmp;

    batch.set(lessonRef, lesson);
    batch.set(swapRef, swapLesson);

    return batch.commit();

  }

}
