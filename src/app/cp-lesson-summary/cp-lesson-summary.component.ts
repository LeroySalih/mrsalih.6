import { Component, Input, OnInit , Output, EventEmitter} from '@angular/core';
import { Lesson} from '../models/lesson';
import {
  trigger, state, style, animate, transition
} from '@angular/animations';

import { MenuItem } from 'primeng/api';

export interface LessonEvent {
  type: string;
  lesson?: Lesson;
  payload?: any;
}

@Component({
  selector: 'app-cp-lesson-summary',
  templateUrl: './cp-lesson-summary.component.html',
  styleUrls: ['./cp-lesson-summary.component.css'],
  animations: [
    trigger ('highlightState', [
        state('inactive', style({backgroundColor: 'snow'}) ),
        state('active', style({backgroundColor: 'yellow'}) ),
        transition('inactive => active', animate('300ms ease-in')),
        transition('active => inactive', animate('300ms ease-out')),
    ])
  ]
})
export class CpLessonSummaryComponent implements OnInit {

  @Input()
  lesson: Lesson;

  @Input()
  index: number;

  @Input()
  highlightDragArea: boolean;

  @Output()
  lessonEvent: EventEmitter<LessonEvent>;

  items: MenuItem[];

  constructor() {
    this.lessonEvent = new EventEmitter<LessonEvent>();

    this.items = [
      {label: 'Edit', icon: 'fa-edit', command: () => {  this.OnEditLessonClick(); }},
      {label: 'Delete', icon: 'fa-trash', command: () => {  this.onDeleteLessonClick(); }},
      {label: 'Demote', icon: 'fa-angle-down', command: () => { this.onDemoteLesson(); }},
      {label: 'Report Progress', icon: 'fa-check', command: () => {console.error(`Not Yet Implemented`); } }
    ];
  }

  ngOnInit() {
  }

  onReadMoreClick() {
    this.lessonEvent.emit({type: 'READ', lesson: this.lesson});
  }
  OnEditLessonClick() {
    this.lessonEvent.emit({type: 'EDIT', lesson: this.lesson} as LessonEvent);
  }

  onDeleteLessonClick() {
    this.lessonEvent.emit({type: 'DELETE', lesson: this.lesson} as LessonEvent);
  }

  onDemoteLesson() {
    this.lessonEvent.emit({type: 'DEMOTE', lesson: this.lesson} as LessonEvent);
  }

  getHighlightDragArea() {
    return (this.highlightDragArea) ? 'active' : 'inactive';
  }

  onDragStart(event) {
    console.log(`[onDragStart] ${this.index}`);
    this.lessonEvent.emit({type: 'DRAG_START'});
  }

  onDragEnd(event) {
    console.log(`[onDragEnd] ${this.index}`);
    this.lessonEvent.emit({type: 'DRAG_END'});
  }

  onDrop(event) {
    if (event.dragData !== this.index) {
      this.lessonEvent.emit({type: 'SWAP_POSITION', payload: {from: event.dragData, to: this.index}});
      console.log(`[onDrop] moving ${event.dragData} to ${this.index}`);
    }
  }

}
