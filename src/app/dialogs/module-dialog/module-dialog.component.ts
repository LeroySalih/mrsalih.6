import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Module } from '../../models/module';

interface ModuleEditEvent {
  module: Module;
}


@Component({
  selector: 'app-module-dialog-component',
  templateUrl: './module-dialog.component.html',
  styleUrls: ['./module-dialog.component.css']
})
export class ModuleDialogComponent implements OnInit {

  form: FormGroup;
  module: Module;
  description: string;

  title: string;
  subtitle: string;
  category: string;
  bodyText: string;
  constructor( private fb: FormBuilder,
               private dialogRef: MatDialogRef<ModuleDialogComponent>,
               @Inject(MAT_DIALOG_DATA) data) {

    console.log(`[Constructor] received: `, data);

    this.description = 'Edit Module';

    if (data) {
      this.module = data;
    } else {
      this.module = {id: null, title: '', category: '', subtitle: '', bodyText: '', thumbnailUrl: null, order: 0, softwareIcons: []};
    }

   }


  ngOnInit() {

    this.form = this.fb.group({
      title: [this.module.title, []],
      subtitle: [this.module.title, []],
      category: [this.module.category, []],
      bodyText: [this.module.bodyText, []],
      softwareIcons: [this.module.softwareIcons, []]
    });


  }

  save() {
    console.log(`[save] Sending `, this.module);
    console.log(`[save] form values are: `, this.form.value);

    this.module.title = this.form.value.title;
    this.module.subtitle = this.form.value.subtitle;
    this.module.bodyText = this.form.value.bodyText;
    this.module.category = this.form.value.category;
    this.module.softwareIcons = this.form.value.softwareIcons;
    this.dialogRef.close(this.module);
  }

  close() {
    this.dialogRef.close();
  }

}
