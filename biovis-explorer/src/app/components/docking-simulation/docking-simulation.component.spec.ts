import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DockingSimulationComponent } from './docking-simulation.component';

describe('DockingSimulationComponent', () => {
  let component: DockingSimulationComponent;
  let fixture: ComponentFixture<DockingSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DockingSimulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DockingSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
