import { Component, OnInit, Inject } from '@angular/core';

import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


import { Lesson} from '../../models/lesson';

@Component({
  selector: 'app-lesson-dialog',
  templateUrl: './lesson-dialog.component.html',
  styleUrls: ['./lesson-dialog.component.css']
})
export class LessonDialogComponent implements OnInit {

  form: FormGroup;
  lesson: Lesson;
  description: string;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<LessonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

      if (data) {
        this.lesson = data;
      } else {
        this.lesson = {id: null, title: '',  subtitle: '',  order: 0, moduleId: null, logo: '', quizType: 0};
      }
    }

  ngOnInit() {
    this.form = this.fb.group({
      title: [this.lesson.title, []],
      subtitle: [this.lesson.subtitle, []],
      order: [this.lesson.order, []],
      logo: [this.lesson.logo, []]
    });
  }

  save() {
    this.lesson.title = this.form.value.title;
    this.lesson.subtitle = this.form.value.subtitle;
    this.lesson.order = this.form.value.order;
    this.lesson.logo = this.form.value.logo;
    this.dialogRef.close(this.lesson);
  }

  close () {
      this.dialogRef.close();
  }

}
