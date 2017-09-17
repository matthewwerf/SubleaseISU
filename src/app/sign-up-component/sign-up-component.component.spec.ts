import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponentComponent } from './sign-up-component.component';

describe('SignUpComponentComponent', () => {
  let component: SignUpComponentComponent;
  let fixture: ComponentFixture<SignUpComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
