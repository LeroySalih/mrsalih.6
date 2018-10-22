import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.css']
})
export class NewUserDialogComponent implements OnInit {

  form: FormGroup;
  message: string;

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewUserDialogComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) data) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', []],
      password: ['', []]
    });
  }

  save() {
    // attempt a login
    this.message = 'Logging In';
    this.userService.createUser(this.form.value)
      .then(() => {
        console.log('User Logged In');
        this.dialogRef.close();
      })
      .catch((err) => {
        this.message = err.message;
      });

  }

  close() {
    this.dialogRef.close({});
  }

}
