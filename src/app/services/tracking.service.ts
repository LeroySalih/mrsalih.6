import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {DbConfig } from '../db.config';
import { Observable } from 'rxjs';
import { PastPaperAnswers } from '../models/past-paper';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(private afs: AngularFirestore) {
  }

  getPaperResults (): Observable<PastPaperAnswers[]> {
    return this.afs.collection<PastPaperAnswers>(`${DbConfig.PAST_PAPER_ANSWERS}`).valueChanges();
  }
}
