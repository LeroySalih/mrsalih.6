import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren  } from '@angular/core';
import { DOCUMENT} from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LessonService } from '../services/lesson.service';
import { LessonSectionService } from '../services/lesson-section.service';

import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Observable} from 'rxjs/Observable';
import { combineLatest } from 'rxjs';

import { Lesson } from '../models/lesson';
import { LO } from '../models/lo';
import { LOService } from '../services/lo.service';
import { LOProgressService } from '../services/lo-progress.service';

import { MatDialog, MatDialogConfig } from '@angular/material';

import { LessonSection } from '../models/lesson-section';
import { UserService } from '../services/user.service';
import { UserProfile } from '../models/user-profile';
import { LessonProgressService } from '../services/lesson-progress.service';
import { LessonProgress } from '../models/lesson-progress';
import { LOProgress } from '../models/lo-progress';
import { SectionPayload } from '../models/section-payload';
import { SectionPayloadService } from '../services/section-payload';

import { LODialogComponent} from '../dialogs/lo-dialog/lo-dialog.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { LOEvent } from '../cp-learning-objective/cp-learning-objective.component';
import { MenuItem} from 'primeng/api';
import { SectionEditDialogComponent } from '../dialogs/section-edit-dialog/section-edit-dialog.component';
import { QuestionService } from '../services/question.service';

import {Quiz} from '../models/quiz';
import { Question } from '../models/question';

import { QuestionFactory } from '../models/question-factory';
import { QuestionSpec } from '../models/question-spec';
import { QuestionTypes } from '../enums/question-types';
import { QuestionStatus } from '../enums/question-status';
import { Attempt } from '../models/attempt';

import { CpSectionComponent } from '../cp-section/cp-section.component';
import { CpQuestionComponent } from '../cp-question/cp-question.component';
import { CpLearningObjectivesComponent } from '../cp-learning-objectives/cp-learning-objectives.component';

import * as moment from 'moment';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

export interface Customer {
  name: string; // required field with minimum 5 characters
  addresses: Address[]; // user can have one or more addresses
}

export interface Address {
  street: string;  // required field
  postcode: string;
}

@Component({
  selector: 'app-page-lesson',
  templateUrl: './page-lesson.component.html',
  styleUrls: ['./page-lesson.component.css']
})
export class PageLessonComponent implements OnInit, AfterViewInit {

  @ViewChildren(CpLearningObjectivesComponent, { read: ElementRef} ) private pageHeadings: QueryList<ElementRef>;
  @ViewChildren(CpSectionComponent, { read: ElementRef }) private sectionContents: QueryList<ElementRef>;
  @ViewChildren(CpQuestionComponent, {read: ElementRef }) private quizElements: QueryList<ElementRef>;

  userProfile: UserProfile;
  lessonId = 'Not Set';
  lesson: Lesson;
  sections: LessonSection[];
  lessonProgresses: any = {};
  los: LO[];
  loProgress: {[id: string]: LOProgress} = {};  // { [id: string]:  string}  = {};
  sectionPayloads: { [ id: string]: SectionPayload} = {};
  items: MenuItem[];
  isDragging: boolean;
  questions: Question[];
  currentQuestion: Question;
  currentQuestionIndex = 0;
  quizzes: Quiz[];
  quizDates: Date[] = [];

  assignmentUrl: string;
  // sectionPayloadService: any;

  public myForm: FormGroup; // our form model

  constructor(private route: ActivatedRoute,
              private router: Router,
              private lessonService: LessonService,
              private loService: LOService,
              private loProgressService: LOProgressService,
              private lessonSectionService: LessonSectionService,
              private userService: UserService,
              private lessonProgressService: LessonProgressService,
              private sectionPayloadService: SectionPayloadService,
              private matDialog: MatDialog,
              private messageService: MessageService,
              private questionService: QuestionService,
              private _fb: FormBuilder,

            ) {

             // this.learningObjectiveFeedback = {'PsfYfc3ag8oGkfOS8hQn': 'Not Yet', 'gG18CK2wQ14STjnyBX9B' : 'Got It'};
            this.isDragging = false;
            this.assignmentUrl = 'https://repl.it/student_embed/assignment/1313666/0481d3a37556d7a80661299f0d48dc74';
             }

  ngAfterViewInit()  {

  }

  ngOnInit() {

    console.log(`ngOnInit`);
    const pageParam$: Observable<ParamMap> = this.route.paramMap;
    const user$: Observable<UserProfile> = this.userService.currentUser$;

    const values$ = combineLatest(
      pageParam$,
      user$,
      (page, user) =>  ({page, user})
    );

    values$.subscribe(data => {
      console.log(`Received values ${data}`);
      if (!data.page || !data.user) {
        console.log('No User... returning');
        return; }

      // At this point, we have lessonId and userId.

      this.lessonId = data.page['params']['id'];
      this.userProfile = data.user;

      combineLatest(
          this.lessonService.getLesson(this.lessonId),
          this.lessonSectionService.getLessonSections(this.lessonId),
          this.lessonProgressService.getLessonProgressForUser(this.userProfile.authenticationId, this.lessonId),
          this.loService.getLearningObjectives(this.lessonId),
          this.loProgressService.getLOProgressForUser(this.userProfile.authenticationId, this.lessonId),
          this.sectionPayloadService.getSectionPayloadsForLesson(this.lessonId, this.userProfile.authenticationId),
          this.questionService.getQuizzesForUser(this.lessonId, this.userProfile.authenticationId),
           (lesson: Lesson,
            sections: LessonSection[],
            progress: LessonProgress[],
            los: LO[],
            loProgress: LOProgress[],
            sectionPayloads: SectionPayload[],
            quizzes: Quiz[]) =>
          ({lesson, sections, progress, los, loProgress, sectionPayloads, quizzes})
        ).subscribe((lessonData) => {
            console.log(`Received New Page Data`, lessonData);

            this.lesson = lessonData.lesson;
            this.sections = lessonData.sections;

            this.los = lessonData.los;

            // build completion dictionary.
            lessonData.progress.forEach((lp) => {
              this.lessonProgresses[lp.sectionId] = lp.completed;
            } );

            // Build the Learning Objective Progress
           lessonData.loProgress.forEach((loProgress) => {
            this.loProgress[loProgress.learningObjectiveId] = loProgress;
           });

            // build section comments>
            lessonData.sectionPayloads.forEach((sectionPayload: SectionPayload) => {
              this.sectionPayloads[sectionPayload.sectionId] = sectionPayload;
            });

            this.quizzes = lessonData.quizzes;

            if (this.quizzes && this.quizzes.length) {

              this.quizDates = [];
              this.quizzes.forEach((quiz) => {
                this.quizDates.push(quiz.timestamp);
              });


              this.questions = this.quizzes[0].questions;
              this.currentQuestion = this.questions[this.currentQuestionIndex];

            } else {
              this.quizDates = [];
              this.questions = null;
              this.currentQuestion = null;
              this.currentQuestionIndex = 0;
            }
            /*
            if (lessonData.quiz) {
              this.questions =  lessonData.quiz['questions'];
              this.currentQuestion = this.questions[this.currentQuestionIndex];
            }
            */

        });

    });

  }

  gotoHome() {
    console.log('gotoHome');
    this.pageHeadings.toArray()[0].nativeElement.scrollIntoView(true);
  }

  gotoSection(index) {
    this.sectionContents.toArray()[index].nativeElement.scrollIntoView(true);
    // this.sectionContents.toArray()[index].nativeElement.scrollIntoView(true);
  }

  gotoQuiz() {
    this.quizElements.toArray()[0].nativeElement.scrollIntoView(true);
    // el.scrollIntoView(true);
  }

  convertDate(date): string {
    // const dt = new Date(date);
    // console.log(`[convertDate]:: `, dt);
    // return dt.toDateString();
    // console.log(date.toDate());

    const quizDate = moment(date.toDate());
    const today = moment(new Date());

    if (Math.abs(quizDate.diff(today, 'days')) > 0) {
      return quizDate.toLocaleString();
    } else {
        return quizDate.fromNow();
    }
  }


  OnShowReport() {
    console.log(`OnShowReport`);
    this.router.navigate(['/quiz-report', this.lessonId]);
  }

  onQuizChange(event) {
    console.log(`onQuizChange`, event);
    this.currentQuestionIndex = 0;
    this.questions = this.quizzes[event.value].questions;
    this.currentQuestion = this.questions[this.currentQuestionIndex];
  }

  getSectionPayload (section: LessonSection) {
    return this.sectionPayloads[section.id];
  }

  onLOStatusChange(event) {
    console.log(`onLOStatusChange`, event);

     const lop: LOProgress = {
      userId: this.userProfile.authenticationId,
      className: this.userProfile.className,
      learningObjectiveId: event.lo.id,
      lessonId: this.lessonId,
      status: event.status
    };

    this.loProgressService.setProgressForUser(lop)
      .then(() => { console.log(`Progress updated.`); })
      .catch((err) => {console.log(`Error Updating Progress`, err); });

  }

  getNextOrder(los: LO[]) {

    let nextOrder = 0;

    los.forEach((lo) => {
      nextOrder = Math.max(nextOrder, lo.order);
    });

    return (los) ? nextOrder + 1 : 0;
  }


  onNewLO(lo: LO) {
    console.log(`[onLOEvent]`, event);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    dialogConfig.data = lo;
    dialogConfig.data.order = this.getNextOrder(this.los);

    const dialogRef = this.matDialog.open(LODialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (data) => {
        console.log('[newLO] from dlg: ', data);
        if (data) {
           this.loService.saveLO(data as LO)
           .then(() => {
              this.messageService.add(
                {severity: 'success', summary: 'Module Saved'}
              );
            });
        }

      }
  );

  }

  onEditLO(lo: LO) {
    console.log(`onEditLO`, lo);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    dialogConfig.data = lo;
    // dialogConfig.data.order = this.getNextOrder(this.los);

    const dialogRef = this.matDialog.open(LODialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (data) => {
        console.log('[editLO] from dlg: ', data);
        if (data) {
           this.loService.saveLO(data as LO)
           .then(() => {
              this.messageService.add(
                {severity: 'success', summary: 'Module Saved'}
              );
            });
        }

      }
  );
  }

  onDeleteLO (lo: LO) {
    console.log(`onDeleteLO`, lo);

    this.loService.deleteLO(lo)
      .then(() => {
        this.messageService.add({severity: 'success', summary: 'LO Deleted'});
      });
  }

  onLOEvent(event: LOEvent) {
    switch (event.type) {
      case 'ADD' : return this.onNewLO(event.lo);
      case 'EDIT' : return this.onEditLO(event.lo);
      case 'DELETE': return this.onDeleteLO(event.lo);
      default: console.error(`[onLOEvent] UNKNOWN LOEvent type`); break;
    }
  }

  saveSectionNote(event) {

  }


  onSectionCompletedChange(section: LessonSection, completed: boolean) {
    console.log(`[onSectionCompletedChange]`, section, completed);

    const sectionComplete: SectionPayload = {
        id: `${section.lessonId}-${section.id}-${this.userProfile.authenticationId}`,
        userId: this.userProfile.authenticationId,
        completed: completed,
        lessonId: this.lessonId,
        sectionId: section['id'],
        };

    this.sectionPayloadService.saveSectionPayload(sectionComplete)
          .then(() => {console.log(`onCompletedChange ${section.id} updated to`, completed); } )
          .catch((error) => { console.log('onCompletedChange error: ', error.message); });

  }

  onSectionEvent(event) {
    console.log(`[onSectionEvent]`, event);

    switch (event.type) {
      case 'COMPLETE_STATUS' : return this.onSectionCompletedChange(event.section, event.payload);
      case 'SWAP_POSITION' : return this.onSectionSwapPosition (event.payload.from, event.payload.to);
      case 'DELETE' : return this.onSectionDelete(event.section);
      case 'DRAG_START': this.isDragging = true; break;
      case 'DRAG_END' :  this.isDragging = false; break;
      case 'NEW' : return this.onSectionNew();
      case 'EDIT' : return this.onSectionEdit(event.section);
    }
  }

  onQuestionEvent(event) {
    console.log(`onQuestionEvent`, event);
    switch (event.type) {
      case 'CORRECT_ANSWER' : return this.correctQuestion(event.payload.answer);
      case 'INCORRECT_ANSWER' : return this.incorrectQuestion(event.payload.answer);
      case 'NEXT_QUESTION' : return this.nextQuestion();
      case 'PREVIOUS_QUESTION' : return this.previousQuestion();
      default: console.error('[onQuestionEvent] UNKNOWN EVENT TYPE');
    }
  }

  onSideNavEvent(event) {
    console.log(`[onSideEvent]`, event.type);
    switch (event.type) {
      case 'GOTO_HOME' : return this.gotoHome();
      case 'GOTO_SECTION': return this.gotoSection(event.payload);
      case 'GOTO_QUIZ': return this.gotoQuiz();
      default: console.error(`onSideNavEvent:: UNKNOWN EVENT TYPE`);
    }
  }

  addAttemptToQuestions(attempt: Attempt, question: Question): void {
    question.addAttempt(attempt);
  }

  correctQuestion(answer: number) {
     this.questions[this.currentQuestionIndex].status = QuestionStatus.Correct;
     const attempt: Attempt = {status: QuestionStatus.Correct, answer };
     this.addAttemptToQuestions(attempt, this.questions[this.currentQuestionIndex]);

    // this.messageService.add({severity: 'success', summary: 'Correct!'});
    this.currentQuestionIndex = (this.currentQuestionIndex + 1) % 5;
    this.currentQuestion = this.questions[this.currentQuestionIndex];

    // save the questions
    this.questionService.saveQuizForUser(
      this.lessonId,
      this.userProfile.authenticationId,
      {questions: this.questions, timestamp: new Date()});
  }

  incorrectQuestion(answer: number) {

    // set the status to incorrect
    this.questions[this.currentQuestionIndex].status = QuestionStatus.Incorrect;

    const attempt: Attempt = {status: QuestionStatus.Incorrect, answer };
     this.addAttemptToQuestions(attempt, this.questions[this.currentQuestionIndex]);

    // save the questions status
    this.questionService.saveQuizForUser(
      this.lessonId,
      this.userProfile.authenticationId,
      {questions: this.questions, timestamp: new Date()});
  }

  nextQuestion() {
    this.currentQuestionIndex = (this.currentQuestionIndex + 1) % 5;
    this.currentQuestion = this.questions[this.currentQuestionIndex];
  }

  previousQuestion() {
    this.currentQuestionIndex = (this.currentQuestionIndex + 4) % 5;
    this.currentQuestion = this.questions[this.currentQuestionIndex];
  }


  onSectionSwapPosition(from, to) {
    console.log('[onSectionSwapPosition]');

      if (from > to) {
        this.sections.forEach((s) => {
          if ((s.order - 1) >= to) {
            s.order = s.order + 1;
          }
        });
        this.sections[from].order = to + 1;
      } else {

        this.sections.forEach((s) => {
          if ((s.order - 1 ) >= to) {
            s.order = s.order - 1;
          }
        });

        this.sections[from].order = to + 1;
      }

      this.lessonSectionService.bulkUpdate(this.sections)
        .then(() => {
          this.messageService.add({severity: 'success', summary: 'Sections reordered'});
        })
        .catch((err) => {
          console.error(err.message);
        });
    }

    onSectionEdit (section: LessonSection) {

      console.log(`[onSectionEdit]`);

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;

      dialogConfig.data = section;
      // dialogConfig.data.order = this.getNextOrder(this.los);

      const dialogRef = this.matDialog.open(SectionEditDialogComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(
        (dlgSection) => {
          console.log('[edit Section] from dlg: ', section );
            if (dlgSection) {
              this.lessonSectionService.saveLessonSection(dlgSection)
                  .then(() => {
                    this.messageService.add({severity: 'success', summary: 'Lesson Section Saved.'});
                  });
                }
            });
    }

    onSectionDelete (section: LessonSection) {
      console.log(`[onSectionDelete]`, section);

      this.lessonSectionService.deleteLessonSection(section)
        .then(() => {
          this.messageService.add({severity: 'success', summary: 'Section Deleted'});
        });
    }

    onSectionNew() {
      console.log(`[onSectionNew]`);

      let nextOrder = 0;

      this.sections.forEach((s) => {
        nextOrder = Math.max(nextOrder, s.order);
      });

      this.lessonSectionService.saveLessonSection({
            title: 'New Section',
            type: 'text',
            order: nextOrder + 1,
            options : {showComments: false},
            lessonId: this.lessonId,
            content: '<p>New Section</p>'} as LessonSection)
          .then(() => {
            this.messageService.add({severity: 'success', summary: 'Section Created'});
          });
    }

    createQuiz() {
      console.log(`createQuiz`);
      this.questionService.createQuizforUser(
        this.lessonId,
        this.userProfile.authenticationId,
        this.lesson.quizType)
        .then(() => { this.messageService.add({severity: 'success', summary: 'Quiz Created'}); })
        .catch((err) => {
          this.messageService.add({severity: 'danger', summary: err.message});
        });
    }
}
