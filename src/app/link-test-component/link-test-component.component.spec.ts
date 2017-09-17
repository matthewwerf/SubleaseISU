import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkTestComponentComponent } from './link-test-component.component';

describe('LinkTestComponentComponent', () => {
  let component: LinkTestComponentComponent;
  let fixture: ComponentFixture<LinkTestComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkTestComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkTestComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});