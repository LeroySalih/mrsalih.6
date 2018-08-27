import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {ModuleEvent} from '../cp-module-summary/cp-module-summary.component';
import { Module } from '../models/module';
import {trigger, query, transition, style, animate, animateChild, stagger} from '@angular/animations';

@Component({
  selector: 'app-cp-module-summary-list',
  templateUrl: './cp-module-summary-list.component.html',
  styleUrls: ['./cp-module-summary-list.component.css'],
  animations: [
    trigger ('moduleItems', [

      transition ('* => *', [
        /*
        query (
          ':enter',
          [style({opacity: 0})],
          {optional: true}
        ),*/

        query(':leave',
                [
                    style({ opacity: 1 }),
                    animate('5s', style({ opacity: 0 }))
                ],
                { optional: true }
            ),

        query(
          ':enter',
          [
            style({opacity: 0, transform: 'translateX(100%)'}),
            stagger('0.3s', [
              animate('0.5s', style({opacity: 1, transform: 'translateX(0%)'}))
            ]),
            animateChild()
          ],
          {optional: true}
        )

      ])


    ])
  ]
})
export class CpModuleSummaryListComponent implements OnInit {

  @Input()
  modules: Module[];

  @Output()
  moduleChanged: EventEmitter<ModuleEvent>;

  constructor() {
    this.moduleChanged = new EventEmitter<ModuleEvent>();
  }

  OnModuleChanged(event) {
    this.moduleChanged.emit(event);
  }

  animationStart(event) {
    console.log(`Summary List::Animation Started`, event);
  }

  ngOnInit() {
  }

}
