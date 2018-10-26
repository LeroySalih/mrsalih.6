import { Injectable, Inject } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { DbConfig } from '../db.config';
import { v4 as uuid } from 'uuid';

import {PastPaper, PastPaperAnswers, PastPaperAnswer} from '../models/past-paper';
import { Observable ,  BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PastPaperService {

  constructor (private afs: AngularFirestore) {

  }

  getPastPaperTemplates(): Observable<PastPaper[]> {
    return this.afs.collection<PastPaper>(`${DbConfig.PAST_PAPER_TEMPLATES}`).valueChanges();
  }

  getPastPaperTemplate(pastPaperId: string): Observable<PastPaper> {
    return this.afs.doc<PastPaper>(`${DbConfig.PAST_PAPER_TEMPLATES}/${pastPaperId}`).valueChanges();
  }

  savePastPaperAnswers (answers: PastPaperAnswers): Promise<void> {

    if (answers.id === undefined) {
      answers.id = uuid();
    }

    return this.afs.doc<PastPaperAnswers>(`${DbConfig.PAST_PAPER_ANSWERS}/${answers.id}`)
      .set(answers)
      .catch((err) => {console.error(err); });

  }

  savePastPaperTemplate (paper: PastPaper): Promise<void> {
    if (paper.pastPaperId === undefined) {
      paper.pastPaperId = uuid();
    }

    return this.afs.doc<PastPaper>(`${DbConfig.PAST_PAPER_TEMPLATES}/${paper.pastPaperId}`)
      .set(paper);
  }

  getPastPaperAnswers(userId: string): Observable<PastPaperAnswers[]> {
    return this.afs.collection<PastPaperAnswers>(`${DbConfig.PAST_PAPER_ANSWERS}`,
      (ref) => ref
        .where('userId', '==', userId)
      )
      .valueChanges();
  }

  getPastPaperAnswersById(pastPaperId: string): Observable<PastPaperAnswers> {
    console.log(`Looking for pastpaper id: ${pastPaperId}`);
    return this.afs.doc<PastPaperAnswers>(`${DbConfig.PAST_PAPER_ANSWERS}/${pastPaperId}`).valueChanges();
  }

  createAnswersFromTemplate(userId: string, pastPaperId: string ) {

    this.afs.firestore.doc(`${DbConfig.PAST_PAPER_TEMPLATES}/${pastPaperId}`).get().then((doc) => {
      const ppt: PastPaperAnswers = doc.data() as PastPaperAnswers;
      ppt.userId = userId;
      ppt.created = Math.ceil( Date.now());
      ppt.answers = ppt.questions.map((q) => {
        q['actual_marks'] = 0;
        q['mistake_type'] = '';
        return q as PastPaperAnswer;
      });

      return this.savePastPaperAnswers(ppt);
    });

  }

  removePastPaperTemplate(pastPaperTemplate: PastPaper): Promise<void> {
    return this.afs.doc<PastPaper>(`${DbConfig.PAST_PAPER_TEMPLATES}/${pastPaperTemplate.pastPaperId}`)
          .delete();
  }
}
