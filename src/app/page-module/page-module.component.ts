import { Component, OnInit } from '@angular/core';
import { Module } from '../models/module';
import { LessonService } from '../services/lesson.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { MessageService } from 'primeng/components/common/messageservice';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MenuItem } from 'primeng/api';


import { Lesson } from '../models/lesson';
import { LessonEvent} from '../cp-lesson-summary/cp-lesson-summary.component';
import { LessonDialogComponent} from '../dialogs/lesson-dialog/lesson-dialog.component';


@Component({
  selector: 'app-page-module',
  templateUrl: './page-module.component.html',
  styleUrls: ['./page-module.component.css']
})
export class PageModuleComponent implements OnInit {

  moduleId = 'Not Set';
  lessons: Lesson[];

  items: MenuItem[];

  isDragging = false;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private readonly lessonService: LessonService,
      private matDialog: MatDialog,
      private messageService: MessageService,
    ) {


   }

  ngOnInit() {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.moduleId = paramMap['params']['id'];

      this.lessonService.getLessons(this.moduleId).subscribe((data: Lesson[]) => {
        this.lessons = data;
      });

    });
  }

  onReadMoreClick(lesson: Lesson) {
    this.router.navigate(['lesson', lesson.id]);
  }

  onLessonEvent(lessonEvent: LessonEvent) {
    console.log(`[onLessonEvent] clicked`, lessonEvent);
    switch (lessonEvent.type) {
      case 'NEW'  : this.newLesson(); break;
      case 'READ' : this.onReadMoreClick(lessonEvent.lesson); break;
      case 'EDIT' : this.onEditLesson(lessonEvent.lesson); break;
      case 'DELETE' : this.onDeleteLesson(lessonEvent.lesson); break;
      case 'DEMOTE' : this.onDemoteLesson(lessonEvent.lesson); break;
      case 'SWAP_POSITION' : return this.onLessonSwapPosition (lessonEvent.payload.from, lessonEvent.payload.to);
      case 'DRAG_START': this.isDragging = true; break;
      case 'DRAG_END' :  this.isDragging = false; break;
      default : return console.error('[onLessonEvent] UNKNOWN EVENT');
    }
  }

  nextLessonOrder(lessons: Lesson[]): number {

    let nextOrder = 0;

    if (lessons === null || lessons === undefined) {
      return nextOrder;
    }

    lessons.forEach((l) => {
      nextOrder = Math.max(nextOrder, l.order);
    });

    return nextOrder + 1;

  }

  newLesson() {
    console.log('[newLesson]');

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const nextOrder = (this.lessons) ? this.nextLessonOrder(this.lessons) : 0;

    const newLesson: Lesson = {
      id: null, title: '',  subtitle: '',
      order: nextOrder, moduleId: this.moduleId};

    dialogConfig.data = newLesson;

    const dialogRef = this.matDialog.open(LessonDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        (data) => {
          console.log('[newLesson] from dlg: ', data);
          if (data) {
            this.lessonService.saveLesson(data as Lesson)
            .then(() => {
                this.messageService.add(
                  {severity: 'success', summary: 'Module Saved'}
                );
              });
          }

        }
    );
  }

  onEditLesson(lesson: Lesson) {
    console.log('[editLesson]', lesson);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    // const newLesson: LessonId = {id: null, title: '',  subtitle: '',  order: 0, moduleId: this.moduleId};
    dialogConfig.data = lesson;

    const dialogRef = this.matDialog.open(LessonDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        (data) => {
          console.log('Dialog output:', data);
          if (data) {
            this.lessonService.saveLesson(data as Lesson)
            .then(() => {
                this.messageService.add({severity: 'success', summary: 'Module Saved'});
              });
          }
        });
  }

  onNewLessonClick() {
    this.onLessonEvent ({type: 'NEW', lesson: null} as LessonEvent);
  }

  onDeleteLesson (lesson: Lesson) {
    console.log (`[onDeleteLesson]`, lesson);
    this.lessonService.deleteLesson(lesson)
      .then(() => {
        this.messageService.add({severity: 'success', summary: 'Lesson deleted'});
      });
  }

  onDemoteLesson(lesson: Lesson) {
    console.log(`[onDemoteLesson]`, lesson);

    const higherLessons: Lesson[] = this.lessons.filter((l) => l.order > lesson.order);

    const swapLesson = higherLessons[0];

    if (!swapLesson) {
      this.lessonService.swapLessonOrder(lesson, swapLesson)
      .then(() => {
        this.messageService.add({severity: 'success', summary: 'Lesson Demoted'});
      });
    }
  }

  onLessonSwapPosition(from: number, to: number) {
    console.log('[onLessonSwapPosition]');

    if (from > to) {
      this.lessons.forEach((s) => {
        if ((s.order - 1) >= to) {
          s.order = s.order + 1;
        }
      });
      this.lessons[from].order = to + 1;
    } else {

      this.lessons.forEach((s) => {
        if ((s.order - 1 ) >= to) {
          s.order = s.order - 1;
        }
      });

      this.lessons[from].order = to + 1;
    }

    this.lessonService.bulkUpdate(this.lessons)
      .then(() => {
        this.messageService.add({severity: 'success', summary: 'Sections reordered'});
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

}
