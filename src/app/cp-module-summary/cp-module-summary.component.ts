import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Module } from '../models/module';
import { MenuItem } from 'primeng/api';
import { trigger, transition, query, style, animate } from '@angular/animations';

export class  ModuleEvent {
  type: string;
  module: Module;
}

@Component({
  selector: 'app-cp-module-summary',
  templateUrl: './cp-module-summary.component.html',
  styleUrls: ['./cp-module-summary.component.css', '../../card.css'],
  animations: [

    trigger ('moduleState', [

      transition ('* => *', [

        query(':enter', [
          style({opacity: 0}),
          animate('1s', style({ opacity: 1}))
        ], {optional: true})

      ])

    ])

  ]
})
export class CpModuleSummaryComponent implements OnInit {

  @Input()
  module: Module;

  @Input()
  readOnly: boolean;

  @Output()
  moduleEvent: EventEmitter<ModuleEvent>;

  items:  MenuItem[];

  constructor() {
    this.moduleEvent = new EventEmitter<ModuleEvent>();

    this.items = [
      {label: 'Edit', icon: 'fa-edit', command: () => {  this.OnEditModuleClick(); }},
      {label: 'Delete', icon: 'fa-trash', command: () => {  this.OnDeleteModuleClick(); }},
    ];
  }

  ngOnInit() {
  }

  OnReadMoreClick(data: Module) {
    this.moduleEvent.emit({type: 'READ', module: this.module});
    // ('[OnReadMore] sending: ', {module: this.module});
    // this.router.navigate(['module', data.id]);
  }


  OnEditModuleClick() {
    this.moduleEvent.emit({type: 'EDIT', module: this.module});
  //  console.log('[OnEditModuleClick] sending: ', {module: this.module});
  }

  OnDeleteModuleClick() {
    this.moduleEvent.emit({type: 'DELETE', module: this.module});
  //  console.log('[OnDeleteModuleClick] sending: ', {module: this.module});
  }

}
