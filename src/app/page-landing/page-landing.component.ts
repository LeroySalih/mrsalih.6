import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';

import { UserService } from '../services/user.service';
import { UserProfile } from '../models/user-profile';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { timer } from 'rxjs/observable/timer';
import { Subscription } from 'rxjs';

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
    ]),

    trigger('userStatsTrigger', [
      state('active', style({
        opacity: 1,
        transform: 'translateX(0%)',
      })),
      state('inactive',   style({
        opacity: 0,
        transform: 'translateX(100%)',
      })),
    //  transition('* <=> active', animate('1000ms ease-in')),
    //  transition('* <=> inactive', animate('1000ms ease-in')),
      transition('active <=> inactive', animate('1000ms ease-in'))
    ]),

  ]
})
export class PageLandingComponent implements OnInit {

  public userProfile: UserProfile;
  signedInState: string;

  newsItems: string[];
  newsItem: string;

  constructor(
            private fb: FormBuilder,
            private router: Router,
            private userService: UserService,
              ) {
    this.signedInState = 'inactive';
  }

  ngOnInit() {
      this.userService.currentUser$.subscribe((user: UserProfile ) => {
        this.userProfile = user;
        this.signedInState = (this.userProfile) ? 'active' : 'inactive';

      });
  }

  animationDone(event) {
    console.log(event);
  }

  signOutClick() {
    this.userService.logOut().then(() => {
      console.log(`[signOutClick] sign out completed`);
    });
  }

}
