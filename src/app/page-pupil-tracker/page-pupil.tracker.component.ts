import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { CitadelPupilService} from '../services/citadel/pupil.service';
import { CitadelSpecificationService, Specification, Section } from '../services/citadel/specification.service';
import { CitadelPastPaperService, PastPaperTemplate, Question } from '../services/citadel/past-paper.service';

import {combineLatest} from 'rxjs';


@Component({
  selector: 'my-app',
  templateUrl: './page-pupil-tracker.component.html',
  styleUrls: [ './page-pupil-tracker.component.css' ]
})
export class PagePupilTrackerComponent implements OnInit  {
  name = 'Angular';

  chart = new Chart({
    chart: {
      type: 'line'
    },
    title: {
      text: 'Linechart'
    },
    credits: {
      enabled: false
    },
    series: []
  });

  pupils: string[];
  pupilScores: any;

  series1: number[];
  series2: number[];
  currentPupilName: string;

  specs: Specification[];
  ppts: {[id: string]: PastPaperTemplate};

  constructor(private pupilService: CitadelPupilService,
              private specificationService: CitadelSpecificationService,
              private pastPaperService: CitadelPastPaperService

  ) {
    this.ppts = {};
  }

  buildSeries(pupilName) {
    const cPupilPapers = this.pupilScores[pupilName].papers;

    this.series1 = cPupilPapers[Object.keys(cPupilPapers)[0]].map((paper) =>                    {
                        return paper.score;
                      });

    if (Object.keys(cPupilPapers).length > 1) {
      this.series2 = cPupilPapers[Object.keys(cPupilPapers)[1]].map((paper) =>                    {
                        return paper.score;
                      });
    } else {
      this.series2 = [];
    }

    this.chart.addSerie({name: '2017', data: this.series1});
    this.chart.addSerie({name: '2018', data: this.series2});

  }

  clearChart() {
    while (this.chart.ref.series.length > 0) {
      this.chart.ref.series[0].remove(true);
    }
  }

  onPupilChange(event) {

    this.clearChart();
    this.buildSeries(event);
    this.chart.ref.setTitle({text: event});
    this.clearSpecs();
    this.buildSpecChecks(event, this.pupilScores );

  }

   formPaperKey (dt: string, title: string) {
     console.log(dt, title);
     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

     let month = dt.substr(dt.length - 2, 2);
     month = months[parseInt(month, 10) - 1];

     return `${dt.substr(0, 4)}-${month}-${title}`;

   }

  clearSpecs() {
    this.specs.forEach((spec) => {
      spec.section.forEach((s) => {
        if (s['results'] !== undefined) {
          delete s['results'];
        }
      });
    });
  }

  paperExists(paperTitle: string): boolean {
    return this.ppts[paperTitle] !== undefined;
  }

  updateSpec(paperTitle: string, questionNumber: number, actualScore: number) {
    const ppt = this.ppts[paperTitle];
    if (ppt === undefined) {
     //   console.log(`cant find `,  paperTitle, this.ppts)
        return ;
    } else {
    //  console.log(`found`, paperTitle);
    }

    const question = ppt['questions'][questionNumber];

    // If no question is found, exit
    if (question === undefined) {
    //  console.log('Question not found.')
      return;
    }

    // If no question type found (intermediate or advanced questions)
    if (question.type === '') {
    //  console.log('Question Type not found.')
      return;
    }

    const specId = parseInt(question.type.substr(0, 1), 10);
    const sectionId = parseInt(question.type.split(' ')[0].substr(2), 10);
    const specification = this.specs[specId];
    if (specification === undefined) {
    //   console.log(`specification id . not found`, specId, 'qt:', question)
      return ;
    }

    const section = specification.section[sectionId - 1];

    if (section === undefined) {
    //   console.log(`cant find `, sectionId, specification.section)
      return;
    }

    if (section['results'] === undefined) {
      section['results'] = [];
    }

    // TODO:  Push G, if actual marks == available marks!
    // Push a A if actual marks . > 0
    // Push R if actual marks == 0
    section['results'].push({paperTitle: paperTitle,
                             available: question['available_marks'],
                             actual: actualScore
                            });
    // console.log('Added', paperTitle, question['available_marks'], actualScore);

  }

  buildSpecChecks(pupil: string, pupilScores: any, ) {

    const papers = pupilScores[pupil]['papers'];

    let papersFound = 0, papersNotFound = 0;

    Object.keys(papers).forEach((yearKey) => {
      papers[yearKey].forEach((paper) => {
        if (!this.paperExists(paper.title)) {
          // console.log('Paper Not Found', paper.title);
          papersNotFound ++;
        } else {
          // console.log('Paper Found', paper.title);
          papersFound ++;
          paper.scores.forEach((score, index) => {
            // console.log('Updating Spec for ', paper.title,index, score)
            this.updateSpec(paper.title, index, score);
            });
        }
      });
    });

    // console.log(`Papers Found ${papersFound}, not Found ${papersNotFound}`);
  }

  ngOnInit () {

    combineLatest(
      this.pupilService.getPupils(),
      this.pupilService.getPupilScores(),
      this.specificationService.getSpecifications(),
      this.pastPaperService.getPastPaperTemplates(),

      (pupils: string[], pupilScores, specifications, ppts) =>
      ({pupils, pupilScores, specifications, ppts})
    ).subscribe((data) => {

      // Assign the list of pupils
      this.pupils = data.pupils;
      this.currentPupilName = this.pupils[0];
      this.pupilScores = data.pupilScores;

      data.ppts.forEach((ppt: PastPaperTemplate) => {
          // console.log(ppt);
          this.ppts[this.formPaperKey(ppt.date, ppt.paperTitle)] = ppt;
      });

      // Assign the specifications (sorted)
      const specs: Specification[] = data.specifications as Specification[];
      this.specs = specs.sort((a, b) => (a.sectionOrder > b.sectionOrder) ? 1 : -1);

      this.onPupilChange(this.pupils[0]);
    });
  }
  // add point to chart serie
  addPoint() {
    this.chart.addPoint(Math.floor(Math.random() * 10));
  }
}
