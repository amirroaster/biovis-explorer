import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathwayAnalysisComponent } from './pathway-analysis.component';

describe('PathwayAnalysisComponent', () => {
  let component: PathwayAnalysisComponent;
  let fixture: ComponentFixture<PathwayAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathwayAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathwayAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
