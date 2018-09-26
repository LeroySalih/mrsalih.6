import { Component, OnInit } from '@angular/core';
import { ModuleService } from '../services/module.service';
import { Module } from '../models/module';
import { v4 as uuid } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-admin-modules',
  templateUrl: './page-admin-modules.component.html',
  styleUrls: ['./page-admin-modules.component.css']
})
export class PageAdminModulesComponent implements OnInit {

  constructor(private moduleService: ModuleService,
              private router: Router
    ) { }

  modules: Module[];

  ngOnInit() {
    this.moduleService.getModules().subscribe((modules) => {
      this.modules = modules;
    });
  }

  onAddModule() {
    const id = uuid();

    const newModule: Module = {title: `new module-${this.modules.length}`,
      subtitle: '',
      thumbnailUrl: '',
      bodyText: '',
      order: this.modules.length,
      category: '',
      softwareIcons: [],
      id: id};

    this.moduleService.saveModule(newModule)
      .then(() => {
        this.router.navigate([`admin/modules/module/${id}`]);
      });
  }

}
