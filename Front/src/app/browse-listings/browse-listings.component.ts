import { Component, OnInit } from '@angular/core';
import { ListingInfo } from '../models/listing';
import { Observable } from 'rxjs';
import { BrowseListingsService } from './browse-listings-service';

@Component({
  selector: 'app-browse-listings',
  templateUrl: './browse-listings.component.html',
  styleUrls: ['./browse-listings.component.css']
})

export class BrowseListingsComponent implements OnInit {

	private ListingList: ListingInfo[];
  private isLoaded: boolean;

  constructor(private browseListingsService: BrowseListingsService) { }

  ngOnInit() {
    this.isLoaded = false;
    this.browseListingsService.getListings().subscribe( ListingInfo => { 
      this.ListingList = ListingInfo
      this.isLoaded = true;

    });
  }
}
