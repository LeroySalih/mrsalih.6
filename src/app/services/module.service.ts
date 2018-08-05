import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable ,  BehaviorSubject } from 'rxjs';

import { Module } from '../models/module';
import { v4 as uuid } from 'uuid';
import { DbConfig } from '../db.config';
import { Lesson } from '../models/lesson';
@Injectable()
export class ModuleService {


  constructor(private afs: AngularFirestore) {

  }

  getModule (moduleId: string): Observable<Module> {
    return this.afs.doc<Module>(`${DbConfig.MODULES}/${moduleId}`).valueChanges();
  }

  getModules(): Observable<Module[]> {
    const collection = this.afs.collection<Module>(DbConfig.MODULES, ref => ref.orderBy(DbConfig.ORDER_FIELD, 'asc'));

    return collection.valueChanges();
  }

  saveModule (module: Module): Promise<void> {

    console.log(`[saveModule] received `, module );

    if (module.id === undefined || module.id === null) {
      console.log(`Module Id is undefined, creating new`);
      module.id = uuid();
      module.order = 0;
    }

    return this.afs.doc(`${DbConfig.MODULES}/${module.id}`).set(module);
  }

  deleteModule(module: Module): Promise<void> {
    return this.afs.doc(`${DbConfig.MODULES}/${module.id}`).delete();
  }

}
