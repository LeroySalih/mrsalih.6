import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LessonSection } from '../models/lesson-section';
import { SectionPayload } from '../models/section-payload';


export class SideNavEvent {
  type: string;
  payload: any;
}

@Component({
  selector: 'app-cp-lesson-side-nav',
  templateUrl: './cp-lesson-side-nav.component.html',
  styleUrls: ['./cp-lesson-side-nav.component.css']
})
export class CpLessonSideNavComponent implements OnInit {

  @Input()
  sections: LessonSection[];

  @Input()
  sectionPayloads: { [ id: string]: SectionPayload};

  @Output()
  sideNavEvent: EventEmitter<SideNavEvent>;

  constructor() {
    this.sideNavEvent = new EventEmitter<SideNavEvent>();
  }

  ngOnInit() {
  }

  gotoHome() {
    console.log(`gotoHome`);
    this.sideNavEvent.emit({type: 'GOTO_HOME', payload: null} as SideNavEvent);
  }

  gotoSection(index) {
    console.log(`gotoSection`);
    this.sideNavEvent.emit({type: 'GOTO_SECTION', payload: index} as SideNavEvent);
  }

  gotoQuiz() {
    this.sideNavEvent.emit({type: 'GOTO_QUIZ', payload: null} as SideNavEvent);
  }

  checkSectionCompleted(sectionId): boolean {
    return (this.sectionPayloads[sectionId]) ? this.sectionPayloads[sectionId].completed === true : false;
  }

}
