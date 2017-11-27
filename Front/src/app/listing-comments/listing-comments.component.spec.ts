import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingCommentsComponent } from './listing-comments.component';

describe('ListingCommentsComponent', () => {
  let component: ListingCommentsComponent;
  let fixture: ComponentFixture<ListingCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
