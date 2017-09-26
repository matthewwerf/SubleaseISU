import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInComponentComponent } from './log-in-component.component';

describe('LogInComponent', () => {
  let component: LogInComponentComponent;
  let fixture: ComponentFixture<LogInComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogInComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});