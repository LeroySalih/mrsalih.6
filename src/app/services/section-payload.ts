import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { SectionPayload } from '../models/section-payload';
import { LessonSection } from '../models/lesson-section';

import { v4 as uuid } from 'uuid';

import { DbConfig } from '../db.config';

@Injectable()
export class SectionPayloadService {

  constructor(private afs: AngularFirestore) {
  }

  getSectionPayloadsForLesson(
      lessonId: string,
      userId: string): Observable<SectionPayload[]> {

   // console.log(`[getSectionPayloads]`, lessonId, userId);

    if (lessonId === undefined || userId === undefined) {
      return null;
    }
    const collection = this.afs.collection<SectionPayload>
          (DbConfig.SECTION_PAYLOAD, ref => ref
              .where('lessonId', '==', lessonId)
              .where('userId', '==', userId)
          //    .orderBy('order', 'asc')
            );

    return collection.valueChanges();

  }

  saveSectionPayload (sectionPayload: SectionPayload): Promise<void> {

    console.log(`[saveSectionPayload]`, sectionPayload);

    if (sectionPayload.id === undefined || sectionPayload.id === null) {
      sectionPayload.id = `${sectionPayload.lessonId}-${sectionPayload.id}-${sectionPayload.userId}`;
    }

    return this.afs.doc(`${DbConfig.SECTION_PAYLOAD}/${sectionPayload.id}`)
      .set(sectionPayload, {merge: true});
  }

  setSectionCompletion (section: LessonSection, status: boolean): Promise<void> {

    return this.afs.doc(`${DbConfig.SECTION_PAYLOAD}/${section.lessonId}-${section.id}`)
              .set({completed: status}, {merge: true});

  }

  deleteLO (sectionPayload: SectionPayload): Promise<void> {
    return this.afs.doc(`${DbConfig.SECTION_PAYLOAD}/${sectionPayload.id}`).delete();
  }
}
