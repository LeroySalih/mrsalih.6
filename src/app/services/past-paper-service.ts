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

  savePastPaperAnswers (answers: PastPaperAnswers) {

    if (answers.id === undefined) {
      answers.id = uuid();
    }

    this.afs.doc<PastPaperAnswers>(`${DbConfig.PAST_PAPER_ANSWERS}/${answers.id}`)
      .set(answers)
      .then(() => {console.log('Answers Created'); })
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

  createAnswersFromTemplate(userId: string, pastPaper: PastPaper ) {

    const pastPaperAnswer: PastPaperAnswers = pastPaper as PastPaperAnswers;

    pastPaperAnswer.userId = userId;
    pastPaperAnswer.created = Math.ceil( Date.now());

    pastPaperAnswer.answers = pastPaper.questions.map ((q) => {
      q['actual_marks'] = 0;
      q['mistake_type'] = '';
      return q as PastPaperAnswer;
    });

    this.savePastPaperAnswers(pastPaperAnswer);

  }

  removePastPaperTemplate(pastPaperTemplate: PastPaper): Promise<void> {
    return this.afs.doc<PastPaper>(`${DbConfig.PAST_PAPER_TEMPLATES}/${pastPaperTemplate.pastPaperId}`)
          .delete();
  }
}
