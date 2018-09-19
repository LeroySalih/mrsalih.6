import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Subject ,  Observable } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';

import { UserProfile, UserData } from '../models/user-profile';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DbConfig } from '../db.config';
import { TimeConvertHrsMinsToMins } from '../models/questions/time-convert-hrs-mins-to-mins';
import { v4 as uuid } from 'uuid';

interface Note {
  content: string;
  id?: string;
}

@Injectable()
export class UserService {

  currentUser$: Subject <UserProfile>;

  constructor(private db: AngularFirestore,
              private afs: AngularFirestore,
              private firebaseAuth: AngularFireAuth) {

    // this.db = firebase.firestore();
    this.currentUser$ = new BehaviorSubject<UserProfile>(null);

    firebase.auth().onAuthStateChanged((newUser) => {
      if (newUser) {
       // console.log(`[UserService::onNewUserDetected] New current user.  Getting User profile`);
        // load user details
        const usersRef = this.db.collection('userProfiles');

    //    console.log(`matching userProfile on ${newUser['uid']}`);
        // const query = usersRef.document('authenticationId', '==', newUser['uid'])
        // this.db.collection('userProfiles', ref => ref.where('authenticationId', '==', newUser['uid']))
        const userProfilesRef = db.collection<UserProfile>('userProfiles', ref => ref.where('authenticationId', '==', newUser.uid));
        const userProfiles = userProfilesRef.valueChanges();
        userProfiles.subscribe ((docs) => {
      //      console.log('User Profile recieved:', docs);
            this.currentUser$.next(docs[0]);
        });

      } else {
    //    console.log('[UserService::onNewUserDetected] Log In State Change: No User!');
        this.currentUser$.next(null);
        // No user is signed in.
      }
    });
  }


  createUser (registrationForm: any) {
    firebase.auth().createUserWithEmailAndPassword(registrationForm.userId, registrationForm.password)
    .then((result) => {
   //   console.log(`[AppComponent::OnSubmit] New User Created ${result['uid']}`);
      const newUser = UserProfile.LoadUserFromRegisterForm(registrationForm);
      newUser.authenticationId = result['uid'];
      const userDataId = uuid();
   //   console.log(`[UserService::createUser] Adding User profile`);
      this.db.collection(`${DbConfig.USER_DATA}/${userDataId}`).add({
        authenticationId: newUser.authenticationId,
        name: newUser.name,
        id: userDataId
      })
        .then(() => {console.log('New User Profile Added'); } );
    })
    .catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;

 //     console.log(`Error Occured: ${errorCode} with ${errorMessage}`);
      // ...
    });
  }

  logIn (userName: string, pwd: string): Promise<boolean> {

    return new Promise ((resolve, reject) => {

        this.firebaseAuth.auth.signInWithEmailAndPassword(userName, pwd)
          .then(value => {
    //        console.log('[user-service::LogIn] Login Success');
            resolve (true);
          })
          .catch((err) => {
              reject(err);
          });

    });

  }

  logOut(): Promise <any> {
  //  console.log('%c Oh my heavens! ', 'background: #222; color: #bada55');
  //  console.log('%c[user.service]' + '%cloggout', 'color:red;',  'color:blue');
    return firebase.auth().signOut();
  }

  getUserProfile (userId): Observable<UserData> {

    return this.afs.doc<UserData>(`${DbConfig.USER_DATA}/${userId}`)
          .valueChanges();
  }

  getUsers (): Observable <UserData[]> {
   //  console.log('Requesting users');
    return this.afs.collection<UserData>(`${DbConfig.USER_DATA}`)
      .valueChanges();
  }

  saveUser (user: UserData): Promise<void> {
    return this.afs.doc<UserData>(`${DbConfig.USER_DATA}/${user.id}`).set(user);
  }

}
