import { Component, OnInit } from '@angular/core';
import { SpecificationService } from '../services/specification-service.service';
import { Specification } from '../models/specification';

@Component({
  selector: 'app-page-specifications',
  templateUrl: './page-specifications.component.html',
  styleUrls: ['./page-specifications.component.css']
})
export class PageSpecificationsComponent implements OnInit {

  constructor(private specificationService: SpecificationService) {

  }

  ngOnInit() {
    this.specificationService.getSpecifications().subscribe((specifications: Specification[]) => {
      console.log(specifications);
    });
  }

}
