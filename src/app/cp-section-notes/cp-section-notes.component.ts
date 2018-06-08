import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { SectionNotes, VideoNote } from '../models/section-notes';

export interface SectionNoteChangeEvent {
    sectionId: string;
    sectionNotes: SectionNotes;
}

@Component({
  selector: 'app-cp-section-notes',
  templateUrl: './cp-section-notes.component.html',
  styleUrls: ['./cp-section-notes.component.css']
})
export class CpSectionNotesComponent implements OnInit {

  public myForm: FormGroup; // our form model

  @Input()
  sectionId: string;
  @Input()
  notes: VideoNote[];

  @Output()
  SectionNoteChange: EventEmitter<SectionNotes>;

  constructor(private _fb: FormBuilder) {

    this.SectionNoteChange = new EventEmitter<SectionNotes>();

  }

  ngOnInit() {
    this.myForm = this._fb.group({
       notes:  this._fb.array([this.initNotes()])
    });

    if (this.notes && this.notes.length > 0) {
        this.removeNote(0);
        this.notes.forEach((note) => {
          this.addExitingNote({time:  note.time, comment: note.comment });
        });
      }
    }

  emit (model: SectionNotes) {

    model['sectionId'] = this.sectionId;
    this.SectionNoteChange.emit(model);
  }

  initNotes() {
   return this._fb.group({
     time: [''],
     comment: ['']
   });
  }

  initExistingNote(note: VideoNote) {
    return this._fb.group({
      time: [note.time],
      comment: [note.comment]
    });
  }

  addNote() {
   // add address to the list
   const control = <FormArray>this.myForm.controls['notes'];
   control.push(this.initNotes());
  }

  addExitingNote(note: VideoNote) {
     // add address to the list
   const control = <FormArray>this.myForm.controls['notes'];
   control.push(this.initExistingNote(note));
  }

 removeNote(i: number) {
   // remove address from the list
   const control = <FormArray>this.myForm.controls['notes'];
   control.removeAt(i);
 }

}
