
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { LO } from '../../models/lo';


@Component({
  selector: 'app-lo-dialog',
  templateUrl: './lo-dialog.component.html',
  styleUrls: ['./lo-dialog.component.css']
})
export class LODialogComponent implements OnInit {

  title: string;
  lo: LO;
  form: FormGroup;
  description: 'Learning Objectives';

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<LODialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      this.lo = data;
  }

  ngOnInit() {

    this.form = this.fb.group({
      title: [this.lo.title, []],
    });

  }

  save() {
    this.lo.title = this.form.value.title;
    this.dialogRef.close(this.lo as LO);
  }

  close() {
    this.dialogRef.close();
  }

}
