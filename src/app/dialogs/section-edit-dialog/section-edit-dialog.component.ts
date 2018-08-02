import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { LessonSection } from '../../models/lesson-section';

@Component({
  selector: 'app-section-edit-dialog',
  templateUrl: './section-edit-dialog.component.html',
  styleUrls: ['./section-edit-dialog.component.css']
})
export class SectionEditDialogComponent implements OnInit {

  section: LessonSection;
  form: FormGroup;
  types: any[];

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<SectionEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

      this.section = data;
      this.types = [
        {name: 'text'},
        {name: 'video'},
        {name: 'you-tube-video'},
        {name: 'quiz'},
        {name: 'repl.assignment'}
      ];


     }

  ngOnInit() {
    this.form = this.fb.group({
      type: [this.section.type, []],
      title : [this.section.title, []],
      content: [this.section.content, []],
      videoId: [this.section.options.videoId, []],
      url: [this.section.options.url, []],
      question: [this.section.options.question, []],
      answer: [this.section.options.answer, []],
      quizTypeId: [this.section.options.quizTypeId, []],
      showComments: new FormControl (false)
    });

    this.form.patchValue({showComments: this.getShowCommentsChecked()});

    this.form.valueChanges.subscribe((formValue: any) => {
      // console.log(formValue);
      this.section.type = formValue.type;
      this.section.title = formValue.title;
      this.section.content = formValue.content;

      if (this.section.type === 'video') {
        this.section.options = { videoId: formValue.videoId, showComments: formValue.showComments };
      }

      if (this.section.type === 'you-tube-video') {
        this.section.options = { videoId: formValue.videoId, showComments: formValue.showComments };
      }

      if (this.section.type === 'question') {
        this.section.options = {
          question: formValue.question,
          answer: formValue.answer};
      }

      if (this.section.type === 'quiz') {
        this.section.options = {
          quizTypeId: formValue.quizTypeId
        };
      }

      if (this.section.type === 'repl.assignment') {
        this.section.options = {
          url: formValue.url,
          showComments: formValue.showComments
        };
      }

    });
  }

  close() {
    // console.log(`[close]`);
    this.dialogRef.close();
  }

  save() {
    // console.log(`[save]`, this.section);
    this.dialogRef.close(this.section);
  }

  getShowCommentsChecked(): boolean {
    // console.log(`[getShowCommentsChecked]`, this.section.options);
    return (this.section.options) ? (this.section.options.showComments === true) : false;
  }

}
