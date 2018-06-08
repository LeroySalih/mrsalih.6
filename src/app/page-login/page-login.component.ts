import { Component, OnInit, Input } from '@angular/core';
import { NgForm} from '@angular/forms';
import { UserService } from './../services/user.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-login-form',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})
export class PageLoginComponent implements OnInit {

  status = '';
  onSuccessPath: string;


  constructor(private userService: UserService, private router: Router) {
    this.onSuccessPath = '/home';
   }

  ngOnInit() {
  }

  onSubmit (form: NgForm) {
    console.log(form.value);
    const uName = `${form.value['userName']}@${form.value['schoolId']}.com`;
    const pwd = form.value['password'];
    console.log(`loggin in with ${uName}, ${pwd}`);
    this.status = 'Logging in';
    this.userService.logIn(uName, pwd)
      .then((result) => {
        this.status = 'log in OK';
        this.router.navigate([this.onSuccessPath]);
      })
      .catch((err) => { this.status = err.message; });
  }

  onCancel () {
    console.log('Cancel Clicked');
  }

}
