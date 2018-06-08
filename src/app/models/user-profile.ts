import * as firebase from 'firebase/app';

export class UserProfile {

    constructor (
        public authenticationId: string = 'NOT SET',    // uuid of linked authentication details
        public userId: string = 'NOT SET', // the app user id
        public className: string = 'NOT SET',
        public email: string = 'NOT SET',  // user email (if known)
        public name: string = 'NOT SET'    // user name
    ) {}


    static LoadUserFromFirestore (documentData: firebase.firestore.DocumentData): UserProfile {
        return new UserProfile(documentData['authenticationId'],
                        documentData['userId'],
                        documentData['email'],
                        documentData['name']
                        );
    }

    static LoadUserFromRegisterForm (form: any): UserProfile {
        return new UserProfile ('NOT SET',
                    form['userId'],
                    form['email'],
                    form['name']);
    }
}
