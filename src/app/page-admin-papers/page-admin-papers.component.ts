import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PastPaper, PastPaperQuestion } from '../models/past-paper';
import { PastPaperService } from '../services/past-paper-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Question } from '../models/question';
import { QuestionFactory } from '../models/question-factory';
import { v4 as uuid } from 'uuid';
import { SelectItem } from 'primeng/api';
import { SpecificationService } from '../services/specification-service.service';

@Component({
  selector: 'app-page-admin-papers',
  templateUrl: './page-admin-papers.component.html',
  styleUrls: ['./page-admin-papers.component.css']
})
export class PageAdminPapersComponent implements OnInit, OnChanges {

  pastPaperId: string;
  pastPaperTemplate: PastPaper;
  pastPaperForm: FormGroup;
  selectedQuestion: Question;
  questionTypes: SelectItem[];


  constructor(private activedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private pastPaperService: PastPaperService,
              private specificationService: SpecificationService,
              private router: Router
    ) {
      this.questionTypes = [];
      }

  ngOnInit() {

    this.specificationService.getSpecifications().subscribe((specifications) => {
      specifications.forEach((spec) => {
        spec.section.forEach((section) => {
          this.questionTypes.push({label: `${section.level} ${section.title}`, value: `${section.level} ${section.title}`});
        });
      });
    });

    this.activedRoute.params.subscribe((params) => {
      this.pastPaperId = params['id'];

      this.pastPaperService.getPastPaperTemplate(this.pastPaperId).subscribe((pastPaperTemplate) => {
        /*
        console.log(`Building Past Paper`, pastPaperTemplate);
        this.pastPaperTemplate = pastPaperTemplate;

        this.pastPaperForm = this.fb.group({
          pastPaperId: [this.pastPaperTemplate.pastPaperId, []],
          paperTitle: [this.pastPaperTemplate.paperTitle, []],
          paperLink: [this.pastPaperTemplate.paperLink, []],
          markSchemeLink: [this.pastPaperTemplate.markSchemeLink, []],
          date: [this.pastPaperTemplate.date, []]
        });
        */
        /*
        this.pastPaperForm.valueChanges.subscribe((data) => {
          // console.log(data)
          this.pastPaperTemplate.paperTitle = data.paperTitle;
          this.onEditComplete(null);
        });
        */
      });
    });
  }

  onSubmit(event) {
  }

  ngOnChanges() {
  }

  totalMarks(): number {
    return this.pastPaperTemplate.questions.reduce((previous: number, current) => {
      return previous + current.available_marks;
    }, 0);
  }

  onRowSelected(event) {
    // this.selectedQuestion = event
  }

  onRowUpdate(event) {
    console.log(`Row Edit Detected`, event);
    this.pastPaperTemplate.questions.forEach((question, index) => {
      if (question.number === event['number']) {
        this.pastPaperTemplate.questions[index] = event;
        this.onEditComplete(null);
      }
    });
  }

  onEditComplete(event) {
    // console.log(event);
    // console.log(this.pastPaperTemplate);
    console.log('Saving Paper', this.pastPaperTemplate);
    this.pastPaperService.savePastPaperTemplate(this.pastPaperTemplate);
  }

  onAddPaper() {
    console.log('Adding Paper');
    const id = uuid();
    const newPaper: PastPaper = {pastPaperId: id, date: '', paperTitle: 'New P', paperLink: '', markSchemeLink: '', questions: []};

    this.pastPaperService.savePastPaperTemplate(newPaper)
        .then(() => {
          this.router.navigate([`admin/papers/paper/${id}`]);
        });
  }

  onRemovePastPaper() {
    this.pastPaperService.removePastPaperTemplate(this.pastPaperTemplate)
      .then(() => {
        this.router.navigate([`admin/`]);
      });
  }

  onAddQuestion() {
    console.log('Adding Question');
    const newQuestion: PastPaperQuestion = {
      'number': this.pastPaperTemplate.questions.length + 1,
      'link': '',
      'available_marks': 0,
      'marks': 0,
      'type': '',
      'level': ''};

    this.pastPaperTemplate.questions.push(newQuestion);

    this.pastPaperService.savePastPaperTemplate(this.pastPaperTemplate);

  }

}
