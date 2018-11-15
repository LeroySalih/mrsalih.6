import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

export interface Question {
  available_marks: number;
  level: string;
  number: number;
  type: string;
}

export interface PastPaperTemplate {
  pastPaperId: string;
  paperTitle: string;
  date: string;
  quesitons: Question[];
}

@Injectable()
export class CitadelPastPaperService {

  constructor(private afs: AngularFirestore) { }

  getPastPaperTemplates(): Observable<PastPaperTemplate[]> {
    return this.afs.collection<PastPaperTemplate>('pastPapersTemplate').valueChanges();
  }

}
