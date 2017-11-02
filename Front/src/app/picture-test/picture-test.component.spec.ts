import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureTestComponent } from './picture-test.component';

describe('PictureTestComponent', () => {
  let component: PictureTestComponent;
  let fixture: ComponentFixture<PictureTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
