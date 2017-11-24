import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ListingInfo } from '../models/listing';
import { Headers, Http } from '@angular/http';



@Component({
  selector: 'app-view-listing',
  templateUrl: './view-listing.component.html',
  styleUrls: ['./view-listing.component.css']
})
export class ViewListingComponent implements OnInit {

	private propID: string;
	private sub: any;
	private currentListing: ListingInfo;
	private isLoaded: boolean;


  constructor(private route: ActivatedRoute, private http: Http) { }

  ngOnInit() {
  	this.isLoaded = false;
  	this.sub = this.route.params.subscribe(params => {
       this.propID = params.propertyId;
  	});

  	this.getListing().subscribe(listing => {
  		this.currentListing = listing;
  		this.isLoaded = true;
  	})
	}

	getListing(): Observable<ListingInfo> {
  	// Get the json data string
  	return this.http.put('/property/' + this.propID, {
  		username: localStorage.getItem('username'),
		subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
  	}).map(res => {
  		return new ListingInfo(
             res.json()._id,
             res.json().posterUsername,
             res.json().leasingAgency,
             res.json().rentValue,
             res.json().address,
             res.json().postingMessage,
             res.json().propertyID,
             res.json().bathroomQuantity,
             res.json().roommateQuantity,
             res.json().personalBathroom);
      });
  }
}
