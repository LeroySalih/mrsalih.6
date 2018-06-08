import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable ,  BehaviorSubject } from 'rxjs';

import { SectionNotes } from '../models/section-notes';

@Injectable()
export class SectionNotesService {

  SECTION_NOTES_COLLECTION = 'sectionNotes';

  constructor(private afs: AngularFirestore) {
  }

  getSectionNotesForLesson(userId: string,
                           lessonId: string): Observable<SectionNotes[]> {

   return this.afs.collection<SectionNotes>
          (this.SECTION_NOTES_COLLECTION, ref => ref
              .where('lessonId', '==', lessonId)
              .where('userId', '==', userId))
              .valueChanges();


  }

  setSectionNotes (sectionNotes: SectionNotes) {
    return this.afs
    .doc(`${this.SECTION_NOTES_COLLECTION}/${sectionNotes.sectionId}-${sectionNotes.userId}`)
    .set(sectionNotes);
  }

}

