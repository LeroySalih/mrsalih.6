import { Component, OnInit } from '@angular/core';
import { ClassesService } from '../services/classes.service';
import { Classes } from '../models/classes';
import { UserService } from '../services/user.service';
import { ProgressService } from '../services/progress.service';
import { UserData } from '../models/user-profile';
import { switchMap} from 'rxjs/operators/switchMap';
import { ModuleService } from '../services/module.service';
import { Module } from '../models/module';
import { ModuleSubscription } from '../models/module-subscription';
import { LessonService } from '../services/lesson.service';
import { LOService } from '../services/lo.service';
import { LOProgressService } from '../services/lo-progress.service';
import { LOProgress } from '../models/lo-progress';
import {TreeNode} from 'primeng/api';
import { jsonEval } from '../../../node_modules/@firebase/util';
import { map } from 'rxjs/operators/map';
import { combineLatest } from 'rxjs';
import { Lesson } from '../models/lesson';
import { LO } from '../models/lo';

@Component({
  selector: 'app-page-progress',
  templateUrl: './page-progress.component.html',
  styleUrls: ['./page-progress.component.css'],
  styles: [`
        .kb-row {
            background-color: #1CA979 !important;
            color: #ffffff !important;
        }

        .kb-cell {
            background-color: rgba(200,0,0,0.5) !important;
            color: #ffffff !important;
        }

        .moduleRow {
          font-family: 'Open Sans';
          font-size: 14px;
          font-weight: bold;
        }

        .lessonRow {
          font-family: 'Open Sans';
          font-size: 12px;
          color: rgb(50,50,50);
        }

        .loRow {
          font-family: 'Open Sans';
          font-size: 10px;
          text-decoration: italic;
          color: rgb(100,100,100);
        }
    `]
})
export class PageProgressComponent implements OnInit {

  constructor(private classesService: ClassesService,
              private userService: UserService,
              private moduleService: ModuleService,
              private lessonService: LessonService,
              private loService: LOService,
              private loProgressService: LOProgressService,
              private progressService: ProgressService
              ) { }

  classes: Classes[];
  pupil: UserData;

  moduleSubs: ModuleSubscription[];
  modules: { [id: string]: Module };
  subscribedModules: {[id: string]: Module};
  lessons: { [id: string]: Lesson };
  los: {[id: string]: LO};
  lops: LOProgress[];

  data: TreeNode[];

  ngOnInit() {

          combineLatest(
              this.moduleService.getModuleSubscriptionsForClass('18-7C'),
              this.moduleService.getModules(),
              this.lessonService.getAllLessons(),
              this.loService.getAllLearningObjectives(),
              this.loProgressService.getAllLOPProgressForUser('ascUU5ZHYIMGKXe2TAll1kwWTYj2'),
              (moduleSubs, modules, lessons, los, lops) => {
                return {moduleSubs, modules, lessons, los, lops};
              }
          ).subscribe ((data) => {
            this.moduleSubs = data.moduleSubs;

            // build Module Dictionary
            const tmpModules: {[id: string]: Module} = {};

            data.modules.forEach((module) => {
              tmpModules[module.id] = module;
            });

            // build Subscribed Modules Dictionary
            const tmpSubscribedModules: {[id: string]: Module} = {};
            const tmpSubscribedLessons: {[id: string]: Lesson} = {};

            data.moduleSubs.forEach((sub) => {
              const module = tmpModules[sub.moduleId];
              module['counts'] = {'Not Yet': 0, 'Nearly There': 0, 'Got It': 0};
              tmpSubscribedModules[sub.moduleId] = module;
            });

            // add lessons.
            data.lessons.forEach((lesson) => {

              // create the lesson counts
              lesson['counts'] = {'Not Yet': 0, 'Nearly There': 0, 'Got It': 0};

              // check that the lesson belongs to a module that we are subscribed to,
              if (tmpSubscribedModules[lesson.moduleId]) {

                // if lessons have not been added
                if (tmpSubscribedModules[lesson.moduleId]['lessons'] === undefined) {
                  // create the dictionary.
                  tmpSubscribedModules[lesson.moduleId]['lessons'] = {};
                }
                // add the lesson to a module
                tmpSubscribedModules[lesson.moduleId]['lessons'][lesson.id] = lesson;

                 // also add to a temp lesson Dict.
              tmpSubscribedLessons[lesson.id] = lesson;

              }

            });


            // add lo's to lessons.
            data.los.forEach((lo) => {

              const tmpLesson = tmpSubscribedLessons[lo.lessonId];
              if (tmpLesson) {
                if (tmpSubscribedModules[tmpLesson.moduleId] && tmpLesson) {
                  const lesson = tmpSubscribedModules[tmpLesson.moduleId]['lessons'][lo.lessonId];

                  if (lesson['los'] === undefined) {
                    lesson['los'] = {};
                  }
                  lesson['los'][lo.id] = lo;
                  lesson['los'][lo.id]['counts'] = {'Not Yet': 0, 'Nearly There': 0, 'Got It': 0};
                }
              }

            });

            // update the counts
            data.lops.forEach((lop) => {
              const module = tmpSubscribedModules[lop.moduleId];
              module['counts'][lop.status]  = module['counts'][lop.status] + 1;
              module['lessons'][lop.lessonId]['counts'][lop.status] += 1;
              module['lessons'][lop.lessonId]['los'][lop.learningObjectiveId]['counts'][lop.status] += 1;
            });

            // build grid object
            this.data = [];
            Object.values(tmpSubscribedModules).forEach((module) => {
              const counts = module['counts'];
              console.log(module);
              const dataRow = { data: {
                'title': module.title,
                'Not Yet': counts['Not Yet'],
                'Nearly There' : counts['Nearly There'],
                'Got It' : counts['Got It'],
                'Not Answered': 0,
                'level' : 'module'
              }};

              // add lessons
              dataRow['expanded'] = true;
              dataRow['children'] = [];
              Object.values(module['lessons'])
                .sort((a, b) => a['order'] - b['order'])
                .forEach((lesson: Lesson) => {
                const lessoNCounts = lesson['counts'];

                const lessonRow = { children: [], expanded: true,
                  data: {
                  'title': lesson.title,
                  'Not Answered' : 0,
                  'Not Yet': lessoNCounts['Not Yet'],
                  'Nearly There' : lessoNCounts['Nearly There'],
                  'Got It' : lessoNCounts['Got It'],
                  'level' : 'lesson'
                }};

                if (lesson['los']) {
                  Object.values(lesson['los'])
                    .sort((a, b) => a['order'] - b['order'])
                    .forEach((lo: LO) => {

                      if (lo['counts']['Not Yet'] === 0 &&
                          lo['counts']['Got It'] === 0 &&
                          lo['counts']['Not Yet'] === 0) {
                            dataRow['data']['Not Answered'] += 1;
                            lessonRow['data']['Not Answered'] += 1;
                          }


                    lessonRow['children'].push({expanded: true, data: {
                      'title' : lo.title,
                      'Not Yet': lo['counts']['Not Yet'],
                      'Nearly There' : lo['counts']['Nearly There'],
                      'Got It' : lo['counts']['Got It'],
                      'Not Answered' : (lo['counts']['Not Yet'] === 0 &&
                                        lo['counts']['Got It'] === 0 &&
                                        lo['counts']['Not Yet'] === 0) ? 1 : 0,
                      'level' : 'lo'
                    }});
                  });
                }

                dataRow['children'].push(lessonRow);
              });

              this.data.push(dataRow);
            });

            console.log(`this.Data: `, this.data);

            // this.rebuildGrid();
          });
  }
}
