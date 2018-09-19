import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {

  message: string;
  form: FormGroup;
  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<LoginDialogComponent>,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) data
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', []],
      password: ['', []]
    });
  }

  save() {
    // attempt a login
    this.message = 'Loggin In';
    this.userService.logIn(this.form.value.username, this.form.value.password)
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
