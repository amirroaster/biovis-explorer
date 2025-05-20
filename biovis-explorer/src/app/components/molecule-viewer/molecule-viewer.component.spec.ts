import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoleculeViewerComponent } from './molecule-viewer.component';

describe('MoleculeViewerComponent', () => {
  let component: MoleculeViewerComponent;
  let fixture: ComponentFixture<MoleculeViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoleculeViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoleculeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
