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

const appRoutes: Routes = [
  {path: '', redirectTo: '/landing', pathMatch: 'full'},
  {path: 'landing', component: PageLandingComponent},
  {path: 'modules', component: PageHomeComponent},
  {path: 'login', component: PageLoginComponent},
  {path: 'module/:id', component: PageModuleComponent},
  {path: 'lesson/:id', component: PageLessonComponent},
  {path: 'quiz/:id', component: PageQuizComponent},
  {path: 'quiz-report/:lessonId', component: PageQuizReportComponent},
  {path: 'blog-home', component: PageBlogHomeComponent},
  {path: 'blog/:id', component: PageBlogPostComponent},
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
    NgDragDropModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [
    ModuleService,
    LessonService,
    UserService,
    LOService,
    LOProgressService,
    LessonSectionService,
    AngularFireAuth,
    LessonProgressService,
    SectionPayloadService,
    MessageService,
    QuestionService,

  ],
  bootstrap: [AppComponent],
  entryComponents: [AppComponent, ModuleDialogComponent, LessonDialogComponent, LODialogComponent,
    SectionEditDialogComponent
  ]
})
export class AppModule { }
