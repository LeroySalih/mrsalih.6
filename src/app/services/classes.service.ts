
import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction } from 'angularfire2/firestore';
import { Observable ,  BehaviorSubject } from 'rxjs';

import { Classes } from '../models/classes';

import { v4 as uuid } from 'uuid';
import { DbConfig } from '../db.config';


@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  constructor(private afs: AngularFirestore) { }

  getClasses(): Observable<Classes[]> {

    // console.log(`[getLessons]`, moduleId);

    const collection = this.afs.collection<Classes>(DbConfig.CLASSES);

    return collection.valueChanges();

  }

  getClass(classId: string): Observable<Classes[]> {

    // console.log(`[getLessons]`, moduleId);

    const collection = this.afs.collection<Classes>(DbConfig.CLASSES, ref => ref.where('id', '==', classId).orderBy('order', 'asc'));

    return collection.valueChanges();

  }
}
