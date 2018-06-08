import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable ,  BehaviorSubject } from 'rxjs';

import { LO } from '../models/lo';
import { v4 as uuid } from 'uuid';

@Injectable()
export class LOService {

  LO_COLLECTION = 'lo';

  constructor(private afs: AngularFirestore) {
  }

  getLearningObjectives(lessonId: string): Observable<LO[]> {

    const collection = this.afs.collection<LO>
          (this.LO_COLLECTION, ref => ref
              .where('lessonId', '==', lessonId)
              .orderBy('order', 'asc'));

    return collection.valueChanges();

  }

  saveLO (lo: LO): Promise<void> {

    console.log(`[saveLO]`, lo);

    if (lo.id === undefined || lo.id === null) {
      lo.id = uuid();
    }

    return this.afs.doc(`${this.LO_COLLECTION}/${lo.id}`).set(lo);
  }

  deleteLO (lo: LO): Promise<void> {
    return this.afs.doc(`${this.LO_COLLECTION}/${lo.id}`).delete();
  }

}
