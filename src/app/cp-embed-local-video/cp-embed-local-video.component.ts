import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { DbConfig } from '../db.config';


@Component({
  selector: 'app-cp-embed-local-video',
  templateUrl: './cp-embed-local-video.component.html',
  styleUrls: ['./cp-embed-local-video.component.css']
})
export class CpEmbedLocalVideoComponent implements OnInit {

  safeUrls: SafeUrl[];

  @Input()
  myVideoId: string;

  constructor(private sanitizer: DomSanitizer) {
   // console.log(this.myVideoId);

  }


  ngOnInit() {

    // console.log(`[ngOnInit]`, this.myVideoId);

    if (this.myVideoId) {
      this.safeUrls = this.myVideoId.split(';').map((v) => {
        v = v.trim();

        const url = `${DbConfig.VIDEO_URL_BASE}${v}`;

        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      });
    }
    }

}
