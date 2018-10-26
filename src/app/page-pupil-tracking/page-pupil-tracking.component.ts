import { Component, OnInit } from '@angular/core';
import { TrackingService } from '../services/tracking.service';
import { PastPaperAnswers } from '../models/past-paper';
import { UserService } from '../services/user.service';
import { combineLatest } from 'rxjs';
import { UserProfile, UserData } from '../models/user-profile';

@Component({
  selector: 'app-page-pupil-tracking',
  templateUrl: './page-pupil-tracking.component.html',
  styleUrls: ['./page-pupil-tracking.component.css']
})
export class PagePupilTrackingComponent implements OnInit {

  pastPaperAnswers: PastPaperAnswers[];
  userData: { [id: string]: UserData };

  constructor(private trackingService: TrackingService,
              private userService: UserService
    ) {
      this.userData = {};
    }

  ngOnInit() {
    combineLatest(
      this.userService.getUsers(),
      this.trackingService.getPaperResults(),
      (users, pastPaperAnswers) => ({users, pastPaperAnswers})
    ).subscribe((data) => {

      data.users.forEach((user) => {
        this.userData[user.authenticationId] = user;
      });

      this.pastPaperAnswers = data.pastPaperAnswers;
    });
  }

  getUserName (pastPaperAnswers: PastPaperAnswers): string {
    return (this.userData[pastPaperAnswers.userId]) ? (this.userData[pastPaperAnswers.userId]).name : '';
  }

  getScore(pastPaperAnswers: PastPaperAnswers): number {
    let scores_sum = 0;

    pastPaperAnswers.answers.forEach((answer) => {
      scores_sum += answer.actual_marks;
    });

    return scores_sum;
  }

}
