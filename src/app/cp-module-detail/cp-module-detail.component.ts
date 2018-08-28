import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { toDictionary } from '../library';

import { Module} from '../models/module';
import { Lesson} from '../models/lesson';
import { LessonSection } from '../models/lesson-section';
import { LessonProgress} from '../models/lesson-progress';

import { UserProfile } from '../models/user-profile';

import { ModuleService } from '../services/module.service';
import { LessonService } from '../services/lesson.service';
import { LessonSectionService } from '../services/lesson-section.service';
import { LessonProgressService } from '../services/lesson-progress.service';
import { UserService } from '../services/user.service';


import { combineLatest } from 'rxjs';
@Component({
  selector: 'app-cp-module-detail',
  templateUrl: './cp-module-detail.component.html',
  styleUrls: ['./cp-module-detail.component.css'],
  animations: [
    trigger ('moduleIdState', [

      transition ('* => *', [

        query('div', [
          style({transform: 'translateY(100%)', opacity: 0}),
          stagger('0.3s', [
            animate('0.5s', style({transform: 'translateY(0)', opacity: 1}))
          ])
        ], {optional : true})

      ])

    ])
  ]
})
export class CpModuleDetailComponent implements OnInit {

  moduleId: string;

  module:  Module;
  lessons: Lesson[];
  sections: LessonSection[];
  lessonProgress: LessonProgress[];
  userProfile: UserProfile;

  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private moduleService: ModuleService,
              private lessonService: LessonService,
              private lessonSectionService: LessonSectionService,
              private lessonProgressService: LessonProgressService
  ) { }

  buildData(data) {
    this.module = data.module;
    this.lessons = data.lessons;
    this.sections = data.sections;
    this.lessonProgress = data.lessonProgress;
  }
  loadData() {

    this.userService.currentUser$.subscribe((userProfile: UserProfile) => {

        this.userProfile = userProfile;

        if (userProfile != null) {
          // console.log(`loadData:: userProfile`, userProfile);
          combineLatest(
            this.moduleService.getModule(this.moduleId),
            this.lessonService.getLessons(this.moduleId),
            this.lessonSectionService.getAllLessonSections(),
            this.lessonProgressService.getProgressForUser(this.userProfile.authenticationId),
            // tslint:disable-next-line:arrow-return-shorthand
            (module, lessons, sections, lessonProgress) => {return {module, lessons, sections, lessonProgress}; }
          )
          .subscribe((data) => {
            this.buildData(data);
           });

        }
    });

  }

  formatPercentCompleted(lessonId): string {

    const sections = this.getSectionsForLesson(lessonId).length;
    const completed = this.getProgressForLesson(lessonId).length;

    if (sections === 0) {
      return 'No Sections in Lesson';
    }

    if (completed === 0) {
      return 'Not Started';
    }

    const percent =  Math.ceil(100 * (completed / sections));
    return `${percent}% completed`;

  }

  getProgressPercent(lessonId): number {

    const progress = this.getProgressForLesson(lessonId).length;
    const sections = this.getSectionsForLesson(lessonId).length;
    let result;
    // console.log(`progress: ${progress} sections: ${sections}`);
    if (sections === 0 || progress === 0) {
      result = 0;
    } else {
      result = progress / sections;
    }
    // console.log(result);
    return result;
  }
  getProgressForLesson(lessonId): LessonProgress[] {

    return this.lessonProgress.filter((lp) => (lp.lessonId === lessonId && lp.completed === true));
  }

  getSectionsForLesson(lessonId): LessonSection[] {
    return this.sections.filter((section) => section.lessonId === lessonId);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.moduleId = params['id'];

        this.loadData();
    });
  }

  getRouterState() {
  //  console.log(this.activatedRoute.snapshot.url.toString());
    return this.activatedRoute.snapshot.url.toString();
  }

  animateStart(event) {
  //  console.log(`Animation Starting:`, event);
  }

}
