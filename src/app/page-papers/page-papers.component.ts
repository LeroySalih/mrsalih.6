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
  gotoPaperId = '';

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

         // Create a dictionary of past paper answers
         data.answers.forEach((a: PastPaperAnswers) => {
          this.pastPaperAnswers[a.pastPaperId] = a;
          // const fa: FormArray = this.answersForm.get('answers') as FormArray;
          // fa.push(this.createAnswer(a));
         });

          // Create a dictionary of past papers.
          data.templates.forEach((p) => {

            this.pastPaperDropDownItems.push({label: `${p.date}-${p.paperTitle}`, value: p.pastPaperId});
            this.pastPaperDropDownItems = this.pastPaperDropDownItems.sort ((a, b) => {
               return  a.label > b.label ? 1 : -1;
            });

            // add to dictionary
            // this.pastPapers[p.pastPaperId] = p;

            // Check if Past Paper Answers exist
            // const paperAnswers = this.pastPaperAnswers[p.pastPaperId];

            // if not, create it.  This will cause a refresh of the data through the subscription.
            // if (paperAnswers === undefined) {
            //  this.pastPaperService.createAnswersFromTemplate(userProfile.authenticationId, p);
            // }
          });
      });

    });
  }

  getPapers(): PastPaperAnswers[] {
    if (!this.pastPaperAnswers) {
      return [];
    }
    return Object
          .values(this.pastPaperAnswers)
          .sort(
          (a, b) => ((a.date > b.date) ? 1 : -1));
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

  onSave(event) {
    const pastPaperAnswers: PastPaperAnswers = event.data;
    this.pastPaperService.savePastPaperAnswers(pastPaperAnswers);
  }

  gotoPastPaperAnswers() {
    const id = this.gotoPaperId;
    console.log(id);
    this.router.navigate(['/paper', id]);
  }

}
