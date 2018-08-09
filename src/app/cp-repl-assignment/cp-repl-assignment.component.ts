import { Component, OnInit, Input } from '@angular/core';
import { LessonSection } from '../models/lesson-section';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cp-repl-assignment',
  templateUrl: './cp-repl-assignment.component.html',
  styleUrls: ['./cp-repl-assignment.component.css']
})
export class CpReplAssignmentComponent implements OnInit {

  @Input()
  options: any;

  safeUrl: SafeUrl;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    const url = this.options.url;
    this.safeUrl = this
    .sanitizer
    .bypassSecurityTrustResourceUrl(url);

  }

}
