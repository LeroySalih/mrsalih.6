import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable ,  BehaviorSubject } from 'rxjs';

import { LessonSection } from '../models/lesson-section';
import { DbConfig } from '../db.config';

import { v4 as uuid } from 'uuid';

@Injectable()
export class LessonSectionService {


  constructor(private afs: AngularFirestore) {
  }

  getLessonSections(lessonId: string): Observable<LessonSection[]> {

    const collection = this.afs.collection<LessonSection>
          (DbConfig.SECTIONS, ref => ref.where('lessonId', '==', lessonId).orderBy('order', 'asc'));

    return collection.valueChanges();

  }

  saveLessonSection (section: LessonSection): Promise<void> {

    console.log(`[saveLessonSection]`, section);

    if (section.id === null || section.id === undefined) {
      section.id = uuid();
    }

    return this.afs.doc(`${DbConfig.SECTIONS}/${section.id}`).set(section);
  }

  deleteLessonSection(section: LessonSection) {
    return this.afs.doc(`${DbConfig.SECTIONS}/${section.id}`).delete();
  }

  bulkUpdate (sections: LessonSection[]): Promise<void> {

    console.log(`[bulkUpdate]`, sections);

    const batch = this.afs.firestore.batch();

    sections.forEach((s) => {
        const docRef = this.afs.firestore.doc(`${DbConfig.SECTIONS}/${s.id}`);
        batch.set(docRef, s);
    });

    return batch.commit();

  }

}
