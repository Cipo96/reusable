import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqpSuiteComponent } from './eqp-suite.component';

describe('EqpSuiteComponent', () => {
  let component: EqpSuiteComponent;
  let fixture: ComponentFixture<EqpSuiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EqpSuiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EqpSuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
