import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpEmbedTextContentComponent } from './cp-embed-text-content.component';

describe('CpEmbedTextContentComponent', () => {
  let component: CpEmbedTextContentComponent;
  let fixture: ComponentFixture<CpEmbedTextContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpEmbedTextContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpEmbedTextContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
