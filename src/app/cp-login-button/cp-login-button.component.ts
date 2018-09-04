import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { UserProfile } from '../models/user-profile';


export class LoginEvent {
  type: string;
  data?: any;
}

@Component({
  selector: 'app-cp-login-button',
  templateUrl: './cp-login-button.component.html',
  styleUrls: ['./cp-login-button.component.css']
})
export class CpLoginButtonComponent implements OnInit, OnChanges {

  @Input()
  userProfile: UserProfile;

  userName: string;
  items: any[];

  @Output()
  loginEvent: EventEmitter<LoginEvent>;
  constructor() {

    this.loginEvent = new EventEmitter<LoginEvent>();
   }

  ngOnInit() {

  }

  ngOnChanges() {
    console.log(`Setting userprofile`, this.userProfile);
    if (this.userProfile) {
      console.log(`Setting userprofile`, this.userProfile);
      this.userName = this.userProfile.name;
      this.items = [
        {label: 'Sign Out', icon: 'fa fa-profile', command: () => {
            this.signOut();
        }
      }];
    } else {
      this.userName = 'Guest';
      this.items = [
        {label: 'Sign In', icon: 'fa fa-refresh', command: () => {
          this.signIn();
        }}
      ];
    }
  }

  signOut()  {
    this.loginEvent.emit({type: 'LOG_OUT'});
  }

  signIn() {
    this.loginEvent.emit({type: 'LOG_IN'});
  }

}
