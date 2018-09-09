import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PastPaper, PastPaperAnswers, PastPaperAnswer } from '../models/past-paper';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { countByClassification, sumByClassification } from '../library';
import { Chart } from 'angular-highcharts';
import { isNumberValidator, minValidator, maxValidator} from '../validators';

interface MistakeType {
  name: string;
  code: string;

}

interface PastPaperAnswersEvent {
  type: string;
  data: PastPaperAnswers;
}

@Component({
  selector: 'app-cp-past-paper',
  templateUrl: './cp-past-paper.component.html',
  styleUrls: ['./cp-past-paper.component.css']
})
export class CpPastPaperComponent implements OnInit {

  @Input()
  pastPaperAnswers: PastPaperAnswers;

  answersForm: FormGroup;
  answers: FormArray;
  data: any;

  chart: Chart;

  @Output()
  save: EventEmitter<PastPaperAnswersEvent>;

  mistakeTypes: MistakeType[];

  constructor(private formBuild: FormBuilder) {

    this.save = new EventEmitter<PastPaperAnswersEvent>();
    this.mistakeTypes = [
      {name: 'Not Answered', code: 'NA'},
      {name: 'All Correct', code: 'OK'},
      {name: 'Silly', code: 'SI'},
      {name: 'Serious', code: 'SE'}];

  }

  createAnswers(): FormGroup[] {

    const ansGroups = [];

    console.log(this.pastPaperAnswers.answers);
    this.pastPaperAnswers.answers.forEach((a) => {
      ansGroups.push(this.formBuild.group({number: a.number,
                                           level: a.level,
                                           link: a.link,
                                           available_marks: a.available_marks,
                                           type: a.type,
                                           actual_marks: [a.actual_marks,
                                                            [isNumberValidator,
                                                             minValidator(0),
                                                             maxValidator(a.available_marks),
                                                             Validators.required
                                                            ]],
                                           mistake_type: [a.mistake_type, [ mTypeValidator ]]
                                          }));
    });

    // ansGroups.push(this.formBuild.group({number: 2, marks: 4, type: 'Multiplication'}));

    return ansGroups;
  }

  get formData() { return <FormArray>this.answersForm.get('answers'); }


  buildChart() {
    const actualMarks = this.sumActualMarksByLevel();
    const availableMarks = this.sumAvailableMarksByLevel();

   this.chart.ref.series[1].setData([actualMarks['basic'],
                                     actualMarks['intermediate'],
                                     actualMarks['advanced']]);
   this.chart.ref.series[0].setData([availableMarks['basic'] - actualMarks['basic'] ,
                                     availableMarks['intermediate'] - actualMarks['intermediate'],
                                     availableMarks['advanced'] - actualMarks['advanced']
                                    ]);
  }

  ngOnInit() {
    if (!this.pastPaperAnswers.answers || !this.pastPaperAnswers) {
      return;
    }

    this.answersForm = this.formBuild.group(
    {
          answers: this.formBuild.array(this.createAnswers())
        }
    );

      const actual = this.sumActualMarksByLevel();
      const available = this.sumAvailableMarksByLevel();

    // this.buildChart();
    this.chart = new Chart({
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Marks by Paper area'
      },
      xAxis: {
        categories: ['Basic', 'Intermediate', 'Advanced']
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
          data: [
            available['basic'] - actual['basic'],
            available['intermediate'] - actual['intermediate'],
            available['advanced'] - actual['advanced'],

          ]
          },
        {
          name: 'Correct',
          color: 'green',
          data: [actual['basic'], actual['intermediate'], actual['advanced']]
          },
    ]
    });

    this.answersForm.valueChanges.subscribe((value) => {
      this.buildChart();
    });
    }


  getTotalAvailableMarks(p) {
    if (!p.questions || !p) { return 0; }
    return p.questions.reduce((a, b) => a + b['available_marks'], 0 );
  }

  getTotalActualMarks() {
    if (!this.answersForm.value.answers) { return 0; }

    return this.answersForm.value.answers.reduce((a, b) =>  a + b['actual_marks'], 0);
  }

  countMistakeTypes() {
    const result = countByClassification<PastPaperAnswer>(
            this.answersForm.value.answers,
            (item) => item.mistake_type.code
            );
    return result;
  }

  sumAvailableMarksByLevel() {
    return sumByClassification<PastPaperAnswer>(
        this.answersForm.value.answers,
        (item) => item.level,
        (item) => item.available_marks);
  }

  sumActualMarksByLevel() {
     return sumByClassification<PastPaperAnswer>(
        this.answersForm.value.answers,
        (item) => item.level,
        (item) => item.actual_marks);
  }

  sumAvailableMarksByMistake() {
    return sumByClassification<PastPaperAnswer>(
        this.answersForm.value.answers,
        (item) => this.classifyItem(item),
        (item) => item.available_marks);
  }

  classifyItem(item): string {
    const result = (item.mistake_type.code === 'NA' || item.mistake_type === '') ? 'NA' : item.mistake_type.code;
 //   console.log('Classified as ', item, result);
    return result;
  }

  sumActualMarksByMistake() {
    return sumByClassification<PastPaperAnswer>(
        this.answersForm.value.answers,
        (item) => this.classifyItem(item),
        (item) => item.actual_marks);
  }

  htmlDebug(obj) {
    console.log(obj);
  }

  savePastPaperAnswers(form: FormGroup) {
    this.pastPaperAnswers.answers = form.value.answers;
    this.save.emit({type: 'SAVE', data: this.pastPaperAnswers});
    console.log(form.value);
  }

  hasError(index, formControlName): string {

    const errors = this.getErrors(index, formControlName);

    const result = (errors !== undefined && errors !== null) ? 'error ' : '';
    // console.log('${index} ${formControlName}', errors, result);
    return result;
  }

  getErrors (index, formControlName): {} {
    const fa = this.answersForm.controls.answers as FormArray;
    const control = fa.at(index).get(formControlName);
    if (control) {
      return control.errors;
    }
  }

  onChangeInput(event, index, ) {

    // get the m_type dropdown
    const fa = this.answersForm.controls.answers as FormArray;

    const available_marks = fa.at(index).get('available_marks');
    const actual_marks = fa.at(index).get('actual_marks');
    const m_type = fa.at(index).get('mistake_type');

    if (available_marks.value === actual_marks.value) {
      m_type.setValue({code: 'OK', name: 'All Correct'});
    }
  }

}



export function mTypeValidator (control: FormControl): {[s: string]: boolean} {

  const fg = control.parent;
  if (!fg) {
    return null;
  }

  const available_marks = fg.get('available_marks').value;
  const actual_marks = fg.get('actual_marks').value;

  console.log(`${available_marks} ${actual_marks} ${control.value.code}`);
  if (available_marks === actual_marks && control.value.code !== 'OK') {
    return {'InvalidValueEq': true};
  }

  if (available_marks !== actual_marks && control.value.code === 'OK') {
    return {'InvalidValueNeq': true};
  }

  return null;
}

