import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LO } from '../models/lo';
import { LessonProgress } from '../models/lesson-progress';
import { LOProgress } from '../models/lo-progress';
import { OnStatusChangeEvent } from '../cp-learning-objective/cp-learning-objective.component';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { LOEvent } from '../cp-learning-objective/cp-learning-objective.component';


@Component({
  selector: 'app-cp-learning-objectives',
  templateUrl: './cp-learning-objectives.component.html',
  styleUrls: ['./cp-learning-objectives.component.css']
})
export class CpLearningObjectivesComponent implements OnInit {

  @Input()
  los: LO[];

  @Input()
  lessonProgress: LessonProgress[];

  @Input()
  loProgress: { [id: string]:  LOProgress}  = {};

  @Input()
  isAdmin = false;

  @Output()
  statusChange: EventEmitter<OnStatusChangeEvent>;

  @Output()
  loEvent: EventEmitter<LOEvent>;

  lessonId: string;

  constructor(private route: ActivatedRoute) {
    this.statusChange = new EventEmitter<OnStatusChangeEvent>();
    this.loEvent = new EventEmitter<LOEvent>();
  }


  ngOnInit() {
    // console.log(this.loProgress);
    this.route.params.subscribe((params: ParamMap) => {
      this.lessonId = params['id'];
    });
  }

  getLoFeedback(lo): string {
    return (this.loProgress[lo.id]) ? this.loProgress[lo.id].status : '';
  }

  onStatusChange(event) {
    this.statusChange.emit(event);
  }
  onLOAddClick() {
    // console.log(`[onLOAddClick]`);
    this.loEvent.emit({type: 'ADD', lo: {id: null, title: '', order: 0, lessonId: this.lessonId}} as LOEvent);
  }

  onLOEvent(event: LOEvent) {
   //  console.log(`[onLOEvent] `, event);
    this.loEvent.emit(event);
  }

}
