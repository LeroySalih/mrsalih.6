import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-cp-embed-video',
  templateUrl: './cp-embed-video.component.html',
  styleUrls: ['./cp-embed-video.component.css']
})
export class CpEmbedVideoComponent implements OnInit {

  safeUrl: SafeUrl;

  @Input()
  myVideoId: string;

  constructor(private sanitizer: DomSanitizer) {
   // console.log(this.myVideoId);
  }

  ngOnInit() {
   //  console.log(this.myVideoId);
    const url = `https://www.youtube.com/embed/${this.myVideoId}`;
    this.safeUrl = this
    .sanitizer
    .bypassSecurityTrustResourceUrl(url);

  }

}
