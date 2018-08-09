import { Component, OnInit } from '@angular/core';
import { ClassesService } from '../services/classes.service';
import { Classes } from '../models/classes';
import { UserService } from '../services/user.service';
import { ProgressService } from '../services/progress.service';
import { UserData } from '../models/user-profile';
import { switchMap} from 'rxjs/operators/switchMap';
import { ModuleService } from '../services/module.service';
import { Module } from '../models/module';
import { ModuleSubscription } from '../models/module-subscription';
import { LessonService } from '../services/lesson.service';
import { LOService } from '../services/lo.service';
import { LOProgressService } from '../services/lo-progress.service';
import { LOProgress } from '../models/lo-progress';

@Component({
  selector: 'app-page-progress',
  templateUrl: './page-progress.component.html',
  styleUrls: ['./page-progress.component.css']
})
export class PageProgressComponent implements OnInit {

  constructor(private classesService: ClassesService,
              private userService: UserService,
              private moduleService: ModuleService,
              private lessonService: LessonService,
              private loService: LOService,
              private loProgressService: LOProgressService,
              private progressService: ProgressService
              ) { }

  classes: Classes[];
  pupil: UserData;
  moduleSubscriptions: ModuleSubscription[];
  modules: { [id: string]: Module };
  lops: { [id: string]: LOProgress};

  ngOnInit() {

    this.progressService.getAllProgressForPupil('RbdQpgJivIUd8Nu2aU4S')
      .subscribe((pupil) => {
          this.modules = { };
          this.lops = {};
          this.pupil = pupil;

          this.loProgressService.getAllLOPProgressForUser('ascUU5ZHYIMGKXe2TAll1kwWTYj2')
                                .subscribe((lops) => {
                                    console.log(`Received LOPS `, lops);
                                    lops.forEach((lop) => {
                                      this.lops[lop.learningObjectiveId] = lop;
                                    });
                                });

          this.moduleService.getModuleSubscriptionsForClass(this.pupil.className)
            .subscribe((data: ModuleSubscription[]) => {
                console.log(data);
                this.moduleSubscriptions = data;

                this.moduleSubscriptions.forEach((ms) => {
                  this.moduleService.getModule(ms.moduleId)
                    .subscribe((module) => {

                        this.lessonService.getLessons(module.id)
                          .subscribe((lessons) => {

                            module['lessons'] = lessons;
                            this.modules[module.id] = module;

                            lessons.forEach((lesson) => {
                              this.loService.getLearningObjectives(lesson.id)
                              .subscribe((los) => {
                                lesson['los'] = los;
                              });
                          });

                          });
                    });
                });

            });
      });
  }

  getModules(): Module[] {
    return Object.values(this.modules);
  }

  checkLOStatus (loId): string {
    if (this.lops === undefined) {
      return 'UD';
    }
    // console.log(this.lops);
    return (this.lops[loId]) ? this.lops[loId].status : 'NF';
  }

}
