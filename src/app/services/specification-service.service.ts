import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Specification } from '../models/specification';
import { Observable } from 'rxjs';
import { DbConfig } from '../db.config';

@Injectable({
  providedIn: 'root'
})
export class SpecificationService {

  constructor(private afs: AngularFirestore) { }

  getSpecifications(): Observable<Specification[]> {
    return this.afs.collection<Specification>(`${DbConfig.SPECIFICATIONS}`).valueChanges();
  }
}
