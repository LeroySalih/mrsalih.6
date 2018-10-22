import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PastPaperService } from '../services/past-paper-service';
import { PastPaperAnswers } from '../models/past-paper';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { isNumberValidator, minValidator, maxValidator} from '../validators';

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

  pastPaperId: string;
  pastPaperAnswers: PastPaperAnswers;
  mistakeTypes: MistakeType[];
  answersForm: FormGroup;

  constructor(private activeRoute: ActivatedRoute,
              private formBuild: FormBuilder,
              private pastPaperService: PastPaperService) {

    this.mistakeTypes = [
      {name: 'Not Answered', code: 'NA'},
      {name: 'All Correct', code: 'OK'},
      {name: 'Silly', code: 'SI'},
      {name: 'Serious', code: 'SE'}];

  }



  marksEntered(row) {
    console.log(row);
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: ParamMap) => {
      this.pastPaperId = params['id'];

      this.pastPaperService.getPastPaperAnswersById(this.pastPaperId).subscribe((pastPaperAnswers) => {
        this.pastPaperAnswers = pastPaperAnswers;

      });
    });
  }

  tableEdited(event) {
    // console.log('Table Change Detected', this.pastPaperAnswers);
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
