import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';

import { UserService } from '../services/user.service';
import { UserProfile } from '../models/user-profile';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-landing',
  templateUrl: './page-landing.component.html',
  styleUrls: ['./page-landing.component.css'],
  animations: [
    trigger('signInTrigger', [
      state('inactive', style({
        opacity: 1,
        transform: 'translateX(0%)'
      })),
      state('active',   style({
        opacity: 0,
        transform: 'translateX(-100%)'
      })),
      transition('* <=> active', animate('1000ms ease-in')),
      transition('* <=> inactive', animate('1000ms ease-in')),
      transition('active <=> inactive', animate('1000ms ease-in'))
    ]),


    trigger('signOutTrigger', [
      state('inactive', style({
        opacity: 0,
        transform: 'translateX(100%)',
      })),
      state('active',   style({
        opacity: 1,
        transform: 'translateX(0%)',
      })),
    //  transition('* <=> active', animate('1000ms ease-in')),
    //  transition('* <=> inactive', animate('1000ms ease-in')),
      transition('active <=> inactive', animate('1000ms ease-in'))
    ]),

// frmLoginTrigger

    trigger('frmLoginTrigger', [
      state('active', style({
        opacity: 0,
        transform: 'translateX(100%)',
      })),
      state('inactive',   style({
        opacity: 1,
        transform: 'translateX(0%)',
      })),
    //  transition('* <=> active', animate('1000ms ease-in')),
    //  transition('* <=> inactive', animate('1000ms ease-in')),
      transition('active <=> inactive', animate('1000ms ease-in'))
    ])
  ]
})
export class PageLandingComponent implements OnInit {

  private userProfile: UserProfile;
  signedInState: string;
  frmLoginForm: FormGroup;
  frmData: any;
  signInStatusMsg: string;

  constructor(
            private fb: FormBuilder,
            private router: Router,
            private userService: UserService,
              ) {
    this.signedInState = 'inactive';
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

      this.userService.currentUser$.subscribe((user: UserProfile ) => {
        this.userProfile = user;
        this.signedInState = (this.userProfile) ? 'active' : 'inactive';

      });

  }

  animationDone(event) {
    console.log(event);
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

  signOutClick() {
    this.userService.logOut().then(() => {
      console.log(`[signOutClick] sign out completed`);
    });
  }

}
