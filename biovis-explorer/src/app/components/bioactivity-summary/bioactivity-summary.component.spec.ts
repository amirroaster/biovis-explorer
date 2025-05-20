import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BioactivitySummaryComponent } from './bioactivity-summary.component';

describe('BioactivitySummaryComponent', () => {
  let component: BioactivitySummaryComponent;
  let fixture: ComponentFixture<BioactivitySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BioactivitySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BioactivitySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
