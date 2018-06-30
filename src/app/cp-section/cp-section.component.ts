import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LessonSection } from '../models/lesson-section';
import { Lesson } from '../models/lesson';
import { SectionPayload } from '../models/section-payload';
import { QuestionEvent } from '../cp-question/cp-question.component';

import { MenuItem } from 'primeng/api';
import {
  trigger, state, style, animate, transition
} from '@angular/animations';

export interface SectionEvent {
  type: string;
  section?: LessonSection;
  payload?: any;
}

@Component({
  selector: 'app-cp-section',
  templateUrl: './cp-section.component.html',
  styleUrls: ['./cp-section.component.css'],
  animations: [
    trigger ('highlightState', [
        state('inactive', style({backgroundColor: 'snow'}) ),
        state('active', style({backgroundColor: 'yellow'}) ),
        transition('inactive => active', animate('300ms ease-in')),
        transition('active => inactive', animate('300ms ease-out')),
    ])
  ]
})
export class CpSectionComponent implements OnInit {

  @Input()
  section: LessonSection;

  @Input()
  payload: SectionPayload;

  @Output()
  sectionEvent: EventEmitter<SectionEvent>;

  @Output()
  questionEvent: EventEmitter<QuestionEvent>;

  @Input()
  index: number;

  @Input()
  highlightDragArea: boolean;

  @Input()
  userId: string;

  items: MenuItem[];

  constructor() {
    this.sectionEvent = new EventEmitter<SectionEvent>();
    this.questionEvent = new EventEmitter<QuestionEvent>();

    this.items = [
      {label: 'Edit', icon: 'fa-edit', command: () => {  this.OnEditLessonClick(); }},
      {label: 'Delete', icon: 'fa-trash', command: () => {  this.OnDeleteLessonClick(); }},
    ];

  }


  ngOnInit() {
    // console.log(`[ngOnInit]`, this.payload);
  }

  onCompleteChange(chk) {
    this.sectionEvent.emit({type: 'COMPLETE_STATUS', section: this.section, payload: chk.checked});
  }

  getCompleted(): boolean {
    return (this.payload) ? this.payload.completed : false;
  }

  onDragStart(event) {
    console.log(`[onDragStart] ${this.index}`);
    this.sectionEvent.emit({type: 'DRAG_START'});
  }

  onDragEnd(event) {
    console.log(`[onDragEnd] ${this.index}`);
    this.sectionEvent.emit({type: 'DRAG_END'});
  }

  onDrop(event) {
    if (event.dragData !== this.index) {
      this.sectionEvent.emit({type: 'SWAP_POSITION', payload: {from: event.dragData, to: this.index}});
      console.log(`[onDrop] moving ${event.dragData} to ${this.index}`);
    }
  }

  OnAddLessonClick() {
    console.log(`[OnAddLessonClick]`);
    this.sectionEvent.emit({type: 'NEW', section: this.section} as SectionEvent);
  }

  OnEditLessonClick() {
    console.log(`[OnEditLessonClick]`);
    this.sectionEvent.emit({type: 'EDIT', section: this.section} as SectionEvent);
  }

  OnDeleteLessonClick() {
    console.log(`[OnDeleteLessonSectionClick]`);
    this.sectionEvent.emit({type: 'DELETE', section: this.section} as SectionEvent);
  }

  getHighlightDragArea() {
    return (this.highlightDragArea) ? 'active' : 'inactive';
  }

  onQuestonEvent(event: QuestionEvent) {
    event.sectionId  = this.section.id;
    this.questionEvent.emit(event);
  }

}
