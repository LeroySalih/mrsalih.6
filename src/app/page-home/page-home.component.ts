import { Component, OnInit, Inject } from '@angular/core';
import {Router} from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';

import { Module } from '../models/module';
import { Lesson } from '../models/lesson';
import { LessonSection} from '../models/lesson-section';

import { ModuleService } from '../services/module.service';

import {ModuleEvent} from '../cp-module-summary/cp-module-summary.component';

import { MatDialog, MatDialogConfig } from '@angular/material';

import { ModuleDialogComponent} from '../dialogs/module-dialog/module-dialog.component';
import { UserService} from '../services/user.service';
import { LessonService} from '../services/lesson.service';

import { UserProfile } from '../models/user-profile';

import { trigger, transition, query, style, animate } from '@angular/animations';

import { combineLatest} from 'rxjs';
import { toDictionary } from '../library';
import { LessonSectionService } from '../services/lesson-section.service';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.css'],
  animations : [
    trigger('profileState', [

      transition ('* => *', [
        query ('div', [

          style({opacity: 0, transform: 'translateY(50%)'}),
          animate ('0.5s', style ({opacity: 1, transform: 'translateY(0)'}))

        ], {optional : true})
      ])
    ])
  ]
})
export class PageHomeComponent implements OnInit {

  modules: {[id: string]: Module} = {};
  lessons: {[id: string]: Lesson} = {};
  sections: {[id: string]: LessonSection} = {};

  moduleId: string;
  currentModule;

  animal: string;
  userProfile: UserProfile;

  constructor(private moduleService: ModuleService,
              private lessonService: LessonService,
              private sectionService: LessonSectionService,
              private router: Router,
              private matDialog: MatDialog,
              private messageService: MessageService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute
              ) { }

  ngOnInit() {
    console.log(`Route Children`, this.activatedRoute.children);
    this.userService.currentUser$.subscribe((userProfile: UserProfile) => {
      this.userProfile = userProfile;
      if (this.userProfile) {
        this.loadData(this.userProfile);
      }
    });
  }

  buildData(data) {
    console.log(`[buildData]`, toDictionary<Module>(data.modules, 'id'));
    this.modules = toDictionary<Module>(data.modules, 'id');
    this.lessons = toDictionary<Lesson>(data.lessons, 'id');
    this.sections = toDictionary<LessonSection>(data.sections, 'id');

    this.currentModule = this.modules[this.moduleId];
  }

  getModules(): Module[] {
    return Object.values(this.modules);
  }

  loadData(userProfile: UserProfile) {


    combineLatest(
      this.moduleService.getModuleSubscriptionsForClass(userProfile.className),
      this.moduleService.getModules(),
      this.lessonService.getAllLessons(),
      this.sectionService.getAllLessonSections(),
      // tslint:disable-next-line:arrow-return-shorthand
      (moduleSubs, modules, lessons, sections) =>  { return {moduleSubs, modules, lessons, sections}; }
    ).subscribe((data) => {

      // this.modules = data.modules;
      this.buildData(data);

    });

    // get all subscribed modules
    // get modules
    // get all lessons
    // get all sections
    // get all section progress

  }

  readMoreClicked(module: Module) {
    this.router.navigate(['module', module.id]);
  }

  onModuleChanged (event: ModuleEvent) {
    console.log(`[onModuleChanged] `, event);
    switch (event.type) {
      case 'READ' : this.readMoreClicked(event.module); break;
      case 'NEW': this.moduleNew(); break;
      case 'EDIT': this.moduleChanged(event.module); break;
      case 'DELETE' : this.moduleDelete(event.module); break;

    }
  }

  moduleNew () {
    console.log(`[moduleNew]`, module);
    this.moduleChanged(null as Module);
  }

  moduleChanged(module: Module) {
    console.log(`[moduleChanged]`, module);
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    dialogConfig.data = module;

    const dialogRef = this.matDialog.open(ModuleDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        (data) => {
          console.log('Dialog output:', data);
          if (data) {
            this.moduleService.saveModule(data as Module)
            .then(() => {
                this.messageService.add(
                  {severity: 'success', summary: 'Module Saved'}
                );
              });
          }

        }
    );
  }

  moduleDelete(module: Module) {
    console.log(`[moduleDelete] called`, module);
    this.moduleService.deleteModule(module)
        .then(() => {
          this.messageService.add({severity: 'success', summary: 'module deleted'});
        });
  }


}

