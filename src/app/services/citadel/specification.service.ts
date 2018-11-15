import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

export interface Section {
  level: string;
  title: string;
}

export interface Specification {
  title: string;
  sectionOrder: number;
  section: Section[];
}

@Injectable()
export class CitadelSpecificationService {

  constructor(private afs: AngularFirestore) { }

  getSpecifications(): Observable<Specification[]> {
    return this.afs.collection<Specification>('specification')
            .valueChanges();
  }

}
