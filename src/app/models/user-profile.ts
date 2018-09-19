import * as firebase from 'firebase';

export class UserProfile {

    constructor (
        public authenticationId: string = 'NOT SET',    // uuid of linked authentication details
        public userId: string = 'NOT SET', // the app user id
        public className: string = 'NOT SET',
        public email: string = 'NOT SET',  // user email (if known)
        public isAdmin: boolean = false,
        public name: string = 'NOT SET'    // user name
    ) {}


    static LoadUserFromFirestore (documentData: firebase.firestore.DocumentData): UserProfile {
        return new UserProfile(documentData['authenticationId'],
                        documentData['userId'],
                        documentData['email'],
                        documentData['isAdmin'],
                        documentData['name']
                        );
    }

    static LoadUserFromRegisterForm (form: any): UserProfile {
        return new UserProfile ('NOT SET',
                    form['userId'],
                    form['email'],
                    form['isAdmin'],
                    form['name']);
    }
}

/* used to bypass the shitty architecture for UserProfile */

export interface UserData {
    authenticationId: string;
    className: string;
    name: string;
    familyName: string;
    isAdmin: boolean;
    id: string;
}
