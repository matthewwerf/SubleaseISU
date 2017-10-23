import { Component, OnInit } from '@angular/core';
import { ListingInfo } from '../models/listing-basic';
import { Headers, Http } from '@angular/http';

@Component({
  selector: 'app-browse-listings',
  templateUrl: './browse-listings.component.html',
  styleUrls: ['./browse-listings.component.css']
})
export class BrowseListingsComponent implements OnInit {

  constructor(private http: Http) { }

  ngOnInit() {

  }

  getListings() {
  	this.http.get('/listAllProperties', )
  }

}
