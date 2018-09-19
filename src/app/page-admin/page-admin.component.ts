import { Component, OnInit } from '@angular/core';
import {TreeNode} from 'primeng/api';
import { PastPaperService } from '../services/past-paper-service';
import { PastPaper } from '../models/past-paper';
import { Router } from '@angular/router';

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
            'data': '',
            'expandedIcon': 'pi pi-clone',
            'collapsedIcon': 'pi pi-clone',
            'children': []
        }
    ]
};

  pastPapers: PastPaper[];

  constructor(private pastPapersService: PastPaperService,
              private router: Router
            ) {

   }

  ngOnInit() {
    this.pastPapersService.getPastPaperTemplates().subscribe((pastPapers: PastPaper[]) => {
      this.pastPapers = pastPapers;

      this.tree.data[1].children = [];
      this.pastPapers.forEach((pastPaper) => {
        this.tree.data[1].children.push(
          {'label': `${pastPaper.date}-${pastPaper.paperTitle}` ,
           'icon': 'fa fa-file-image-o',
           'data': pastPaper.pastPaperId});
      });
    });
  }

  onTreeNodeExpand(event) {

    switch (event.node.data) {
      case 'users' : this.router.navigate(['/admin/users']); break;
      case '': break;
      default:  this.router.navigate([`admin/papers/${event.node.data}`]);
    }
    // console.log(event);
  }

}
