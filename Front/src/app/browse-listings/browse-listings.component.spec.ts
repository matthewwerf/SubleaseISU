import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseListingsComponent } from './browse-listings.component';

describe('BrowseListingsComponent', () => {
  let component: BrowseListingsComponent;
  let fixture: ComponentFixture<BrowseListingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseListingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
