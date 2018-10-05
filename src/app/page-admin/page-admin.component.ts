import { Component, OnInit } from '@angular/core';
import {TreeNode} from 'primeng/api';
import { PastPaperService } from '../services/past-paper-service';
import { PastPaper } from '../models/past-paper';
import { Router } from '@angular/router';
import { ModuleService } from '../services/module.service';
import { combineLatest } from 'rxjs';
import { Module } from '../models/module';

@Component({
  selector: 'app-page-admin',
  templateUrl: './page-admin.component.html',
  styleUrls: ['./page-admin.component.css']
})
export class PageAdminComponent implements OnInit {

  tree = {
    'data':
    [
        {
            'label': 'Users',
            'data': 'users',
            'expandedIcon': 'pi pi-users',
            'collapsedIcon': 'pi pi-users',
            'children': []
        },
        {
            'label': 'Past Papers',
            'data': 'papers',
            'expandedIcon': 'pi pi-clone',
            'collapsedIcon': 'pi pi-clone',
            'children': []
        },
        {
          'label': 'Specifications',
          'data': 'specifications',
          'expandedIcon': 'pi pi-users',
            'collapsedIcon': 'pi pi-users',
            'children': []
        },
        {
          'label': 'Modules',
          'data': 'modules',
          'expandedIcon': 'pi pi-pencil',
          'collapsedIcon': 'pi pi-pencil'
        }
    ]
};

  pastPapers: PastPaper[];
  modules: Module[];

  constructor(private pastPapersService: PastPaperService,
              private moduleService: ModuleService,
              private router: Router
            ) {

   }

  ngOnInit() {
    combineLatest(
      this.moduleService.getModules(),
      this.pastPapersService.getPastPaperTemplates(),
      (modules, pastPapers) => ({ modules, pastPapers})
    ).subscribe((data) => {

      this.pastPapers = data.pastPapers.sort((p1, p2) => {

        const k1 = parseInt(p1.date.replace('-', ''), 10);
        const k2 = parseInt(p2.date.replace('-', ''), 10);

        return k2 - k1;

      });

      this.tree.data[1].children = [];
      this.pastPapers.forEach((pastPaper) => {
        this.tree.data[1].children.push(
          {'label': `${pastPaper.date}-${pastPaper.paperTitle}` ,
           'icon': 'fa fa-file-image-o',
           'data': `pp:${pastPaper.pastPaperId}`});
      });

      this.modules = data.modules;
      this.tree.data[3].children = [];
      this.modules.forEach((module) => {
        this.tree.data[3].children.push(
          {'label': module.title,
           'icon' : 'fa fa-file-image-o',
           'data' : `m:${module.id}`
          });
      });
    });
  }

  decodeNavigation (data: string) {
    const items = data.split(':');
    switch (items[0]) {
      case 'pp': return this.router.navigate([`admin/papers/paper/${items[1]}`]);
      case 'm' : return this.router.navigate([`admin/modules/module/${items[1]}`]);
    }
  }
  onTreeNodeExpand(event) {
    console.log(event);
    switch (event.node.data) {
      case 'users' : this.router.navigate(['/admin/users']); break;
      case 'specifications' : this.router.navigate(['/admin/specifications']); break;
      case 'papers' : this.router.navigate(['/admin/papers']); break;
      case 'modules': this.router.navigate(['/admin/modules']); break;
      case '': break;
      default:  this.decodeNavigation(event.node.data);
    }
    // console.log(event);
  }

}
