import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { UserProfile, UserData } from '../models/user-profile';


@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  constructor(private afs: AngularFirestore,
              private userService: UserService
  ) { }

  getAllProgressForPupil (pupilId): Observable<UserData> {
    // get class the pupil is a member of
    // get the modules pupil class is subscribed to.
    // get the los for modules.
    // get the lo-progress for the pupil
    return this.userService.getUserProfile (pupilId);

  }
}
