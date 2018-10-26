import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { PageHomeComponent } from './page-home/page-home.component';
import { PageModuleComponent } from './page-module/page-module.component';
import { PageLessonComponent } from './page-lesson/page-lesson.component';
import { PageLoginComponent} from './page-login/page-login.component';

import { environment } from '../environments/environment';
import { ModuleService } from './services/module.service';
import { LessonService } from './services/lesson.service';

import { LessonSectionService} from './services/lesson-section.service';

import { UserService } from './services/user.service';
import { CpLearningObjectiveComponent } from './cp-learning-objective/cp-learning-objective.component';
import { LessonProgressService } from './services/lesson-progress.service';
import { LOService} from './services/lo.service';
import { LOProgressService } from './services/lo-progress.service';
import { CpSectionNotesComponent } from './cp-section-notes/cp-section-notes.component';
import { SectionNotesService } from './services/section-notes.service';
import { CpEmbedVideoComponent } from './cp-embed-video/cp-embed-video.component';
import { CpLearningObjectivesComponent } from './cp-learning-objectives/cp-learning-objectives.component';
import { CpEmbedLocalVideoComponent } from './cp-embed-local-video/cp-embed-local-video.component';
import { CpEmbedTextContentComponent } from './cp-embed-text-content/cp-embed-text-content.component';

import { MaterialModule } from './material.module';
import { PrimeNGModule } from './primeng.module';
import { Message} from 'primeng/components/common/api';
import { MessageService} from 'primeng/components/common/messageservice';
import { CpModuleSummaryComponent } from './cp-module-summary/cp-module-summary.component';
import { MatDialogModule } from '@angular/material';
import { ModuleDialogComponent } from './dialogs/module-dialog/module-dialog.component';
import { LessonDialogComponent } from './dialogs/lesson-dialog/lesson-dialog.component';
import { CpLessonSummaryComponent } from './cp-lesson-summary/cp-lesson-summary.component';
import { LODialogComponent } from './dialogs/lo-dialog/lo-dialog.component';
import { CpSectionComponent } from './cp-section/cp-section.component';
import { SectionPayloadService } from './services/section-payload';

import { NgDragDropModule } from 'ng-drag-drop';
// import { CpSectionEditComponent } from './cp-section-edit/cp-section-edit.component';
import { SectionEditDialogComponent } from './dialogs/section-edit-dialog/section-edit-dialog.component';
import { CpQuestionComponent } from './cp-question/cp-question.component';
import { KatexModule } from 'ng-katex';
import { QuestionService } from './services/question.service';
import { PageQuizComponent } from './page-quiz/page-quiz.component';
import { CpQuestionStatusBarComponent } from './cp-question-status-bar/cp-question-status-bar.component';
import { PageLandingComponent } from './page-landing/page-landing.component';

import { MomentModule } from 'angular2-moment';
import { CpLessonSideNavComponent } from './cp-lesson-side-nav/cp-lesson-side-nav.component';
import { CpLoginComponent } from './cp-login/cp-login.component';
import { CpTickerComponent } from './cp-ticker/cp-ticker.component';
import { CpSiteBannerComponent } from './cp-site-banner/cp-site-banner.component';
import { PageQuizReportComponent } from './page-quiz-report/page-quiz-report.component';
import { CpQuizComponent } from './cp-quiz/cp-quiz.component';
import { CpLoadingComponent } from './cp-loading/cp-loading.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CpSectionQuizComponent } from './cp-section-quiz/cp-section-quiz.component';
import { PageBlogPostComponent } from './page-blog-post/page-blog-post.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpXsrfCookieExtractor } from '@angular/common/http/src/xsrf';
import { PageBlogHomeComponent } from './page-blog-home/page-blog-home.component';
import { CpCardComponent } from './cp-card/cp-card.component';
import { CpReplAssignmentComponent } from './cp-repl-assignment/cp-repl-assignment.component';
import { PageProgressComponent } from './page-progress/page-progress.component';
import { CpModuleSummaryListComponent } from './cp-module-summary-list/cp-module-summary-list.component';
import { CpModuleDetailComponent } from './cp-module-detail/cp-module-detail.component';
import { GraphComponent } from './graph/graph.component';
import { CanAccessAdminActivate} from './guards/CanAccessAdminActivate';
import { CpLoginButtonComponent } from './cp-login-button/cp-login-button.component';
import { LoginDialogComponent } from './dialogs/login-dialog/login-dialog.component';
import { PagePapersComponent } from './page-papers/page-papers.component';
import { CanAccessContentActivate } from './guards/CanAccessContentActivate';
import { PastPaperService } from './services/past-paper-service';
import { CpPastPaperComponent } from './cp-past-paper/cp-past-paper.component';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { PageAdminComponent } from './page-admin/page-admin.component';
import { PageAdminUsersComponent } from './page-admin-users/page-admin-users.component';
import { PageAdminPapersComponent } from './page-admin-papers/page-admin-papers.component';
import { PageSpecificationsComponent } from './page-specifications/page-specifications.component';
import { PageAdminPaperComponent } from './page-admin-paper/page-admin-paper.component';
import { ConfirmationService} from 'primeng/api';
import { PageAdminModulesComponent } from './page-admin-modules/page-admin-modules.component';
import { PageAdminModuleComponent } from './page-admin-module/page-admin-module.component';
import { PageAdminLessonComponent } from './page-admin-lesson/page-admin-lesson.component';
import { NewUserDialogComponent } from './dialogs/new-user-dialog/new-user-dialog.component';
import { PagePaperComponent } from './page-paper/page-paper.component';
import { PagePupilTrackingComponent } from './page-pupil-tracking/page-pupil-tracking.component';

const appRoutes: Routes = [
  {path: '', redirectTo: '/landing', pathMatch: 'full'},
  {path: 'landing', component: PageLandingComponent},
  {path: 'modules', component: PageHomeComponent, canActivate: [CanAccessContentActivate], children: [
  {path: 'module/:id', component: CpModuleDetailComponent}
  ]},
  {path: 'login', component: PageLoginComponent},
  {path: 'moduleDetailTest/:id', component: CpModuleDetailComponent},
  {path: 'modules/:id', component: PageModuleComponent},
  {path: 'lesson/:id', component: PageLessonComponent},
  {path: 'papers', component: PagePapersComponent, canActivate: [CanAccessContentActivate]},
  {path: 'paper/:id', component: PagePaperComponent, canActivate: [CanAccessContentActivate]},
  {path: 'quiz/:id', component: PageQuizComponent},
  {path: 'quiz-report/:lessonId', component: PageQuizReportComponent},
  {path: 'posts', component: PageBlogHomeComponent},
  {path: 'tracking/pupil', component: PagePupilTrackingComponent},
  {path: 'posts/:id', component: PageBlogPostComponent},
  {path: 'progress', component: PageProgressComponent},

  {path: 'admin', component: PageAdminComponent, canActivate: [CanAccessContentActivate, CanAccessAdminActivate], children: [
    {path: 'users', component: PageAdminUsersComponent},
    {path: 'lesson/:id', component: PageAdminLessonComponent},
    {path: 'modules', component: PageAdminModulesComponent, children: [
      {path: 'module/:id', component: PageAdminModuleComponent}
    ]},
    {path: 'papers', component: PageAdminPapersComponent, children: [
      {path: 'paper/:id', component: PageAdminPaperComponent},
    ]},
    {path: 'specifications', component: PageSpecificationsComponent}
  ]},
  {path: '404', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  declarations: [
    AppComponent,
    PageHomeComponent,
    PageModuleComponent,
    PageLessonComponent,
    PageLoginComponent,
    PageQuizComponent,
    PageNotFoundComponent,
    CpLearningObjectiveComponent,
    CpSectionNotesComponent,
    CpEmbedVideoComponent,
    CpEmbedLocalVideoComponent,
    CpLearningObjectivesComponent,
    CpEmbedTextContentComponent,
    CpModuleSummaryComponent,
    ModuleDialogComponent,
    LessonDialogComponent,
    CpLessonSummaryComponent,
    LODialogComponent,
    CpSectionComponent,
  //  CpSectionEditComponent,
    SectionEditDialogComponent,
  CpQuestionComponent,
  PageQuizComponent,
  CpQuestionStatusBarComponent,
  PageLandingComponent,
  CpLessonSideNavComponent,
  CpLoginComponent,
  CpTickerComponent,
  CpSiteBannerComponent,
  PageQuizReportComponent,
  CpQuizComponent,
  CpLoadingComponent,
  CpSectionQuizComponent,
  PageBlogPostComponent,
  PageBlogHomeComponent,
  CpCardComponent,
  CpReplAssignmentComponent,
  PageProgressComponent,
  CpModuleSummaryListComponent,
  CpModuleDetailComponent,
  GraphComponent,
  CpLoginButtonComponent,
  LoginDialogComponent,
  PagePapersComponent,
  CpPastPaperComponent,
  PageAdminComponent,
  PageAdminUsersComponent,
  PageAdminPapersComponent,
  PageSpecificationsComponent,
  PageAdminPaperComponent,
  PageAdminModulesComponent,
  PageAdminModuleComponent,
  PageAdminLessonComponent,
  NewUserDialogComponent,
  PagePaperComponent,
  PagePupilTrackingComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatDialogModule,
    PrimeNGModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    KatexModule,
    MomentModule,
    ChartModule,
    NgDragDropModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [
    ModuleService,
    LessonService,
    CanAccessAdminActivate,
    CanAccessContentActivate,
    UserService,
    LOService,
    LOProgressService,
    LessonSectionService,
    AngularFireAuth,
    LessonProgressService,
    SectionPayloadService,
    MessageService,
    QuestionService,
    PastPaperService,
    ConfirmationService

  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AppComponent,
    ModuleDialogComponent,
    LessonDialogComponent,
    LODialogComponent,
    LoginDialogComponent,
    NewUserDialogComponent,
    SectionEditDialogComponent
  ]
})
export class AppModule { }
