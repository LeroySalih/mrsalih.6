import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModuleService } from './services/module.service';
import { Router } from '@angular/router';

import { Subscription ,  Observable } from 'rxjs';
import { Module} from './models/module';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from './services/user.service';
import { UserProfile } from './models/user-profile';
import { MessageService } from 'primeng/components/common/messageservice';
import { fadeAnimation } from './animations';
import { LoginEvent } from './cp-login-button/cp-login-button.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { LoginDialogComponent } from './dialogs/login-dialog/login-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'app';

  userProfile: UserProfile;
  val = 2;
  constructor(private moduleService: ModuleService,
             private firebaseAuth: AngularFireAuth,
             private userService: UserService,
             private messageService: MessageService,
             private matDialog: MatDialog,
             private router: Router) {

  }

  ngOnInit() {
    this.userService.currentUser$.subscribe((user: UserProfile) => {
    //  console.log(`[ngOnInt] New user detected`, user);
      this.userProfile = user;
    });
  }



  ngOnDestroy() {

  }

  OnLoginEvent(event: LoginEvent) {
    switch (event.type) {
      case 'LOG_IN' : return this.OnLogIn();
      case 'LOG_OUT' : return this.OnLogOut();
    }
  }

  OnLogOut() {
  //  console.log('Logging Out');
    this.router.navigate(['/']);
    this.userService.logOut();
  }

  OnLogIn() {
   // console.log('Loggin In');
    // this.router.navigate(['/login']);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'login-dialog-container';

    // dialogConfig.data = {test: 'test'};
    // dialogConfig.data.order = this.getNextOrder(this.los);

    const dialogRef = this.matDialog.open(LoginDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (data) => {
        // console.log('[newLO] from dlg: ', data);
        // ToDo Add Login Attempt....
      }
  );

  }

  isAdmin() {
    return (this.userProfile && this.userProfile.isAdmin);
  }
  toggleSideButton() {
 //   console.log('CLicked');
  }
}
