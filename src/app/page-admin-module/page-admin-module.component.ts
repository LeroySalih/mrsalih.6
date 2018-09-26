import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleService } from '../services/module.service';
import { Module } from '../models/module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { LessonService } from '../services/lesson.service';
import { Lesson } from '../models/lesson';
import {TreeNode} from 'primeng/api';
import { v4 as uuid} from 'uuid';

@Component({
  selector: 'app-page-admin-module',
  templateUrl: './page-admin-module.component.html',
  styleUrls: ['./page-admin-module.component.css']
})
export class PageAdminModuleComponent implements OnInit {

  moduleId: string;
  module: Module;
  moduleForm: FormGroup;

  lessons: Lesson[];
  items: TreeNode[];

  cols: any[];
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private moduleService: ModuleService,
              private lessonService: LessonService
    ) {

      this.items = [
        {
          data: { name: 'leroy', age: 10},
          children: [
                      { data: {title: 'maths', lessons: 12}},
                      { data: {title: 'maths', lessons: 12}}
                    ]
        }
      ];
      this.cols = [
        { field: 'order', header: 'Order' },
        { field: 'title', header: 'Title' },
        { field: 'subTitle', header: 'Sub title'}
    ];
    }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {

        this.moduleId = params['id'];

        combineLatest(
          this.moduleService.getModule(this.moduleId),
          this.lessonService.getLessons(this.moduleId),
          (module, lessons) => ({module, lessons})
        ).subscribe((data) => {

          this.module = data.module;

          this.moduleForm = this.fb.group({
            title: [this.module.title, []],
            subTitle: [this.module.subtitle, []],
            thumbnaillUrl: [this.module.thumbnailUrl, []],
            bodyText: [this.module.bodyText, []],
            order: [this.module.order],
            category: [this.module.category, []],
            // softwareIcons: [this.module.softwareIcons, []],
            id: [this.module.id, []]
          });

          this.moduleForm.valueChanges.subscribe((value) => {
            this.module.title = value.title;
            this.module.subtitle = value.subTitle;
            this.module.thumbnailUrl = value.thumbnaillUrl;
            this.module.bodyText = value.bodyText;
            this.module.order = value.order;
            this.module.category  = value.category;

            this.moduleService.saveModule(this.module);
          });

          this.lessons = data.lessons;

        });

    });
  }

  updateModule() {
    console.log(`Saving: `, this.module);
    this.moduleService.saveModule(this.module);
  }

  onAddLesson() {
    const id = uuid();
    const newLesson: Lesson = {
      id: id,
      title: 'New Lesson',
      subtitle : '',
      order: this.lessons.length,
      logo: '',
      quizType: 0,
      moduleId: this.moduleId
    };

    this.lessonService.saveLesson(newLesson);
  }

  onPromoteLesson (index) {
    console.log(`promoting item ${index}`);
    const lesson = this.lessons[index];
    const prevLesson = this.lessons[index - 1];

    lesson.order = index - 1;
    prevLesson.order = index;

    this.lessonService.saveLesson(lesson);
    this.lessonService.saveLesson(prevLesson);
  }

  onDemoteLesson (index) {
    const lesson = this.lessons[index];
    const followingLesson = this.lessons[index + 1];

    lesson.order = index + 1;
    followingLesson.order = index;

    this.lessonService.saveLesson(lesson);
    this.lessonService.saveLesson(followingLesson);
  }

  onRemoveLesson(lesson: Lesson) {
    this.lessonService.deleteLesson(lesson);
  }

  onRemoveModule() {
    this.moduleService.deleteModule(this.module)
      .then(() => {
        this.router.navigate(['/admin/modules']);
      });
  }

}
