import { Component, OnInit, Input } from '@angular/core';
import { LessonSection } from '../models/lesson-section';

@Component({
  selector: 'app-cp-embed-text-content',
  templateUrl: './cp-embed-text-content.component.html',
  styleUrls: ['./cp-embed-text-content.component.css']
})
export class CpEmbedTextContentComponent implements OnInit {

  @Input()
  section: LessonSection;

  constructor() { }

  ngOnInit() {
  }

}
