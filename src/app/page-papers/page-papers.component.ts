import { Component, OnInit } from '@angular/core';
import { PastPaperService } from '../services/past-paper-service';
import {PastPaper, PastPaperQuestion, PastPaperAnswers, PastPaperAnswer} from '../models/past-paper';
import { combineLatest } from 'rxjs';
import { UserService } from '../services/user.service';
import { UserProfile } from '../models/user-profile';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { countByClassification, sumByClassification } from '../library';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';

import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-page-papers',
  templateUrl: './page-papers.component.html',
  styleUrls: ['./page-papers.component.css']
})
export class PagePapersComponent implements OnInit {

  pastPapers: {[id: string]: PastPaper};
  pastPaperAnswers: {[id: string]: PastPaperAnswers};

  userProfile: UserProfile;
  pastPaperDropDownItems: SelectItem[];
  pptId = '';

  chart: Chart;

  constructor(private pastPaperService: PastPaperService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private router: Router
            ) {

    this.pastPapers = {};
    this.pastPaperAnswers  = {};
    this.pastPaperDropDownItems = [];

    }

  ngOnInit() {

  //  this.answersForm = this.formBuilder.group({answers: this.formBuilder.array([])});

    this.userService.currentUser$.subscribe((userProfile) => {

      this.userProfile = userProfile;

      if (userProfile === undefined || userProfile === null) {
        return;
      }

      combineLatest(
         this.pastPaperService.getPastPaperTemplates(),
         this.pastPaperService.getPastPaperAnswers(this.userProfile.authenticationId),
        (templates, answers) => ( {templates, answers} )
      ).subscribe((data) => {

        console.log(data);

         // Create a dictionary of past paper answers
         data.answers.forEach((ppa: PastPaperAnswers) => {

          this.pastPaperAnswers[ppa.id] = ppa;
          // const fa: FormArray = this.answersForm.get('answers') as FormArray;
          // fa.push(this.createAnswer(a));
         });

          // Create a dictionary of past papers.
          data.templates.forEach((p) => {

            this.pastPaperDropDownItems.push({label: `${p.date}-${p.paperTitle}`, value: p.pastPaperId});
            this.pastPaperDropDownItems = this.pastPaperDropDownItems.sort ((a, b) => {
               return  a.label > b.label ? 1 : (a.label === b.label ) ? 0 : -1;
            });

            this.chart = new Chart({
              chart: {
                type: 'line'
              },
              title: {
                text: 'Score'
              },
              xAxis: {
                min: 0,
                title: {
                  text: 'Week No.'
                }
              },
              yAxis: {
                min: 0,
                title: {
                  text: 'Marks'
                }
              },
              legend: {
                reversed: true
              },
              plotOptions: {
                series: {
                  stacking: 'normal'
                }
              },
              series: [
                {
                  name: 'Incorrect',
                  color: 'red',
                  data: this.getScores(this.getPapers())
                  }
            ]
            });


          });
      });

    });
  }

  getScores (ppas: PastPaperAnswers[]) {
    const scores = [];

    ppas.forEach((ppa) => {
      const score = ppa.answers.reduce((prev, curr) => {
        return prev + curr['actual_marks']; } , 0);
      scores.unshift(score);
    });

    return scores;
  }

  getPapers(): PastPaperAnswers[] {
    if (!this.pastPaperAnswers) {
      return [];
    }
    return Object
          .values(this.pastPaperAnswers)
          .sort(
          (a, b) => ((a.created < b.created) ? 1 : -1));
  }

  getPaperScore(paperId) {

    const pastPaper: PastPaperAnswers = this.pastPaperAnswers[paperId];

    if (pastPaper === undefined) {
      // console.log(`PastPaperId not found: ${paperId}`);
      // console.log(this.pastPaperAnswers);
      return '';
    }

    let sum = 0;
    pastPaper.answers.forEach((answer) => {
      // console.log (answer.marks || 0);
      sum += answer.actual_marks;
    });

    return sum;
  }

  getDate(dt) {

    const date = moment(new Date(dt));
    return moment(date.toDate()).format('Do MMM YYYY HH:mm');
  }

  onSave(event) {
    const pastPaperAnswers: PastPaperAnswers = event.data;
    this.pastPaperService.savePastPaperAnswers(pastPaperAnswers);
  }

  gotoPastPaperAnswers(id) {
    console.log(id);
    this.router.navigate(['/paper', id]);
  }

  createPastPaperAnswers() {
    // const id = uuid();
    // console.log(`Created ${id}`);
    this.pastPaperService
          .createAnswersFromTemplate(this.userProfile.authenticationId, this.pptId)
          .then((id) => { console.log(`received ${id}`);
       //   this.gotoPastPaperAnswers(id);
        });

  }
}
