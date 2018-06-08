import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition} from '@angular/animations';

import { UserService } from '../services/user.service';
import { UserProfile } from '../models/user-profile';

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
    ])
  ]
})
export class PageLandingComponent implements OnInit {

  private userProfile: UserProfile;
  signedInState: string;

  constructor(private userService: UserService,
              ) {
    this.signedInState = 'inactive';
  }

  ngOnInit() {

      this.userService.currentUser$.subscribe((user: UserProfile ) => {
        this.userProfile = user;
        if (this.userProfile) {
          console.log(`signedInState changed: ${this.signedInState}`);
          this.signedInState = (this.userProfile) ? 'active' : 'inactive';
          console.log(`signedInState: ${this.signedInState}`);
        }
      });

  }

  animationDone(event) {
    console.log(event);
  }

}
