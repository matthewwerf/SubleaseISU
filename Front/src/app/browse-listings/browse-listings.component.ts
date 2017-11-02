import { Component, OnInit } from '@angular/core';
import { ListingInfo } from '../models/listing';
import { BrowseListingsService } from './browse-listings-service';

@Component({
  selector: 'app-browse-listings',
  templateUrl: './browse-listings.component.html',
  styleUrls: ['./browse-listings.component.css']
})

export class BrowseListingsComponent implements OnInit {

	private ListingList: ListingInfo[] = [];

  constructor(private browseListingsService: BrowseListingsService) { }

  ngOnInit() {
  	this.getListings();
  }

  getListings() {
  	this.browseListingsService.getListings().subscribe( ListingInfo => { this.ListingList = ListingInfo});
  }

}
