import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable, Subject} from 'rxjs';

import {UserProfile} from '../models/user-profile';
import { UserService } from '../services/user.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CanAccessAdminActivate implements CanActivate {

  constructor( private userService: UserService) {

  }

  // If usr is logged in and is an admin, allow.
  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {
        this.userService.currentUser$.subscribe((userProfile: UserProfile) => {

          if (userProfile === undefined || userProfile === null) {
            resolve (false);
            return;
          }
          if (userProfile['isAdmin'] === false || userProfile['isAdmin'] === undefined) {
            resolve (false);
          } else {
            resolve (true);
          }

      });
      });

    }
}
