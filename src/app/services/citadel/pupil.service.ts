import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class CitadelPupilService {

  constructor(private http: HttpClient) { }

  getPupils() {
    // console.log('getting pupils')
    return this.http.get('http://localhost:3000/pupils');
  }

  getPupilScores() {
    // console.log('getting data');
    return this.http.get('http://localhost:3000/pupils/scores');
  }

}
