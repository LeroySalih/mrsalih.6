import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LO } from '../models/lo';
import { MenuItem } from 'primeng/api';

export interface OnStatusChangeEvent {
  lo: LO;
  status: string;
}

export class LOEvent {
  type: string;
  lo?: LO;
}


@Component({
  selector: 'app-cp-learning-objective',
  templateUrl: './cp-learning-objective.component.html',
  styleUrls: ['./cp-learning-objective.component.css']
})
export class CpLearningObjectiveComponent implements OnInit {

  @Input()
  lo: LO;

  @Output()
  statusChange: EventEmitter<OnStatusChangeEvent>;

  @Input()
  status: string;

  @Output()
  loEvent: EventEmitter<LOEvent>;

  items: MenuItem[];

  constructor() {
    this.statusChange = new EventEmitter<OnStatusChangeEvent>();
    this.loEvent = new EventEmitter<LOEvent>();

    this.items = [
      {label: 'Edit', icon: 'fa fa-edit', command: () => {  this.onEditLOClick(); }},
      {label: 'Delete', icon: 'fa fa-trash', command: () => {  this.onDeleteLOClick(); }},
      {label: 'Not Yet', icon: 'fa fa-frown-o', command: () => {  this.onStatusChange('Not Yet'); }},
      {label: 'Nearly There', icon: 'fa fa-meh-o', command: () => {  this.onStatusChange('Nearly There'); }},
      {label: 'Got It', icon: 'fa fa-smile-o', command: () => {  this.onStatusChange('Got It'); }},

    ];
  }

  ngOnInit() {
  }

  onStatusChange(status: string) {
    const event: OnStatusChangeEvent = {lo: this.lo, status: status};
    this.statusChange.emit(event);
  }

  onAddClicked() {
  }

  onEditLOClick() {
    console.log(`[onEditClick]`);
    const loEvent: LOEvent = {type: 'EDIT', lo: this.lo};
    this.loEvent.emit(loEvent);
  }

  onDeleteLOClick() {
    console.log(`[onDeleteLOClick]`);
    const loEvent: LOEvent = {type: 'DELETE', lo: this.lo};
    this.loEvent.emit(loEvent);
  }

  getLOStyle(status: string): string {
    switch (status) {
      case 'Got It' : return 'ui-button-success';
      case 'Nearly There' : return 'ui-button-warning';
      case 'Not Yet' : return 'ui-button-danger';
      default: return 'ui-button-secondary';
    }
  }

}
