import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyChartComponent } from './property-chart.component';

describe('PropertyChartComponent', () => {
  let component: PropertyChartComponent;
  let fixture: ComponentFixture<PropertyChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
