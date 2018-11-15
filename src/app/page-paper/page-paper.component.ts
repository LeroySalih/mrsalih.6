import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PastPaperService } from '../services/past-paper-service';
import { PastPaperAnswers } from '../models/past-paper';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { isNumberValidator, minValidator, maxValidator} from '../validators';
import { UserService } from '../services/user.service';
import { UserProfile } from '../models/user-profile';
import { Table } from 'primeng/table';
import { SelectItem } from 'primeng/api';

interface MistakeType {
  name: string;
  code: string;
}

@Component({
  selector: 'app-page-paper',
  templateUrl: './page-paper.component.html',
  styleUrls: ['./page-paper.component.css']
})
export class PagePaperComponent implements OnInit {

  ppaId: string;
  pastPaperAnswers: PastPaperAnswers;
  mistakeTypes: SelectItem[];
  answersForm: FormGroup;
  userData: UserProfile;
  showRows = 10;
  first = 0;

  constructor(private activeRoute: ActivatedRoute,
              private formBuild: FormBuilder,

              private userService: UserService,
              private pastPaperService: PastPaperService) {

    this.mistakeTypes = [
      {label: 'Not Answered', value: 'NA'},
      {label: 'All Correct', value: 'OK'},
      {label: 'Silly', value: 'SI'},
      {label: 'Serious', value: 'SE'}];


      this.userService.currentUser$.subscribe((currentUser) => {
        this.userData = currentUser;
      });

  }

  marksEntered(row) {
    console.log(row);
  }

  onMistakeTypeChange(event) {
    console.log(event, this.pastPaperAnswers);
    this.pastPaperService.savePastPaperAnswers(this.pastPaperAnswers);
  }

  ngOnInit() {

    // Always create a new mark scheme.
    // Only Admin remove a mark scheme.

    this.activeRoute.params.subscribe((params: ParamMap) => {
      this.ppaId = params['id'];

      this.pastPaperService.getPastPaperAnswersById(this.ppaId).subscribe((ppa) => {
        console.log(ppa);
        this.pastPaperAnswers = ppa;
      });
    });
  }

  tableEdited(event) {
    console.log('Table Change Detected', this.pastPaperAnswers);
    this.pastPaperService.savePastPaperAnswers(this.pastPaperAnswers);
  }

}

export function mTypeValidator (control: FormControl): {[s: string]: boolean} {

  const fg = control.parent;
  if (!fg) {
    return null;
  }

  const available_marks = fg.get('available_marks').value;
  const actual_marks = fg.get('actual_marks').value;

  // console.log(`${available_marks} ${actual_marks} ${control.value.code}`);
  if (available_marks === actual_marks && control.value.code !== 'OK') {
    return {'InvalidValueEq': true};
  }

  if (available_marks !== actual_marks && control.value.code === 'OK') {
    return {'InvalidValueNeq': true};
  }

  return null;
}
