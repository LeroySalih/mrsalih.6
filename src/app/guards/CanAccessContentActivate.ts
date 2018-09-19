import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable, Subject} from 'rxjs';

import {UserProfile} from '../models/user-profile';
import { UserService } from '../services/user.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CanAccessContentActivate implements CanActivate {

  constructor( private userService: UserService) {

  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {
        this.userService.currentUser$.subscribe((userProfile: UserProfile) => {

        const canActivate = (userProfile === null || userProfile === undefined) ? false : true;

     //   console.log(`canActivate == ${canActivate}`);

        resolve(canActivate);

      });
      });

    }
}
