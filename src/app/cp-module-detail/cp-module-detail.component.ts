import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate, query } from '@angular/animations';

@Component({
  selector: 'app-cp-module-detail',
  templateUrl: './cp-module-detail.component.html',
  styleUrls: ['./cp-module-detail.component.css'],
  animations: [
    trigger ('moduleIdState', [

      transition ('* => *', [

        query('div', [
          style({transform: 'translateY(100%)', opacity: 0}),
          animate('0.5s', style({transform: 'translateY(0)', opacity: 1}))
        ], {optional : true})

      ])

    ])
  ]
})
export class CpModuleDetailComponent implements OnInit {

  moduleId: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.moduleId = params['id'];
    });
  }

  getRouterState() {
    console.log(this.activatedRoute.snapshot.url.toString());
    return this.activatedRoute.snapshot.url.toString();
  }

  animateStart(event) {
    console.log(`Animation Starting:`, event);
  }

}
