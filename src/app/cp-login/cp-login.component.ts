import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';

export class SignInEvent {
  uname: string;
  password: string;
}

@Component({
  selector: 'app-cp-login',
  templateUrl: './cp-login.component.html',
  styleUrls: ['./cp-login.component.css']
})
export class CpLoginComponent implements OnInit {


  frmLoginForm: FormGroup;
  frmData: any;

  @Output()
  signInEvent: EventEmitter<SignInEvent>;

  signInStatusMsg: string;

  constructor(private fb: FormBuilder,
              private userService: UserService
  ) {
    this.signInEvent = new EventEmitter<SignInEvent>();
  }

  ngOnInit() {
    this.frmLoginForm = this.fb.group({
      schoolId: '',
      userId: '',
      password: ''
    });

    this.frmLoginForm.valueChanges.subscribe((frmData) => {
    this.frmData = frmData;
  });
  }

  signInClick() {

    const uName = `${this.frmData['userId']}@${this.frmData['schoolId']}.com`;
    const pwd = this.frmData['password'];
    console.log(`loggin in with ${uName}, ${pwd}`);
    this.signInStatusMsg = 'Logging in';
    this.userService.logIn(uName, pwd)
      .then((result) => {
        this.signInStatusMsg = '';
    //    this.router.navigate(['/home']);
      })
      .catch((err) => {
        this.signInStatusMsg = 'Log In Error!';
       });
  }
}

