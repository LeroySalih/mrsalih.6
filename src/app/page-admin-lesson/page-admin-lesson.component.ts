import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LessonService } from '../services/lesson.service';
import { Lesson } from '../models/lesson';
import { LessonSectionService } from '../services/lesson-section.service';
import { LessonSection } from '../models/lesson-section';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SectionEditDialogComponent } from '../dialogs/section-edit-dialog/section-edit-dialog.component';

@Component({
  selector: 'app-page-admin-lesson',
  templateUrl: './page-admin-lesson.component.html',
  styleUrls: ['./page-admin-lesson.component.css'],
})
export class PageAdminLessonComponent implements OnInit {

  lessonId: string;
  lesson: Lesson;
  lessonSections: LessonSection[];
  lessonForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
              private lessonService: LessonService,
              private lessonSectionService: LessonSectionService,
              private fb: FormBuilder,
              private matDialog: MatDialog,
    ) { }


  onPromoteLessonSection(index) {
    const lessonSection = this.lessonSections[index];
    const prevLessonSection = this.lessonSections[index - 1];
    lessonSection.order = index - 1;
    prevLessonSection.order = index;

    this.lessonSectionService.saveLessonSection(lessonSection);
    this.lessonSectionService.saveLessonSection(prevLessonSection);
  }

  onDemoteLessonSection(index) {
    const lessonSection = this.lessonSections[index];
    const prevLessonSection = this.lessonSections[index + 1];
    lessonSection.order = index + 1;
    prevLessonSection.order = index;

    this.lessonSectionService.saveLessonSection(lessonSection);
    this.lessonSectionService.saveLessonSection(prevLessonSection);

  }

  onEditLessonSection(lessonSection: LessonSection) {
    console.log('Editing Lesson Section', lessonSection);

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;

      dialogConfig.data = lessonSection;
      dialogConfig.data.order = 1; // this.getNextOrder(this.los);

      const dialogRef = this.matDialog.open(SectionEditDialogComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(
        (dlgSection) => {
          console.log('[edit Section] from dlg: ', lessonSection );
            if (dlgSection) {
              this.lessonSectionService.saveLessonSection(dlgSection)
                  .then(() => {
                  //  this.messageService.add({severity: 'success', summary: 'Lesson Section Saved.'});
                  });
                }
            });
    }

  onDeleteLessonSection(lessonSection) {
    this.lessonSectionService.deleteLessonSection(lessonSection);
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.lessonId = params['id'];

      this.lessonService.getLesson(this.lessonId).subscribe((lesson) => {

        this.lesson = lesson;

        this.lessonForm = this.fb.group({
          title: [lesson.title, []],
          subtitle: [lesson.subtitle, []],
          order: [lesson.order, []],
          logo: [lesson.logo, []]
        });

        this.lessonSectionService.getLessonSections(this.lessonId).subscribe((lessonSections) => {
          this.lessonSections = lessonSections;
        });


        this.lessonForm.valueChanges.subscribe((value) => {
          this.lesson.title = value.title;
          this.lesson.subtitle = value.subtitle;
          this.lesson.order = value.order;

          this.lessonService.saveLesson(this.lesson);
        });

      });

    });
  }

}
