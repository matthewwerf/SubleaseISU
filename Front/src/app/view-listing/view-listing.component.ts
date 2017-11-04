import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-view-listing',
  templateUrl: './view-listing.component.html',
  styleUrls: ['./view-listing.component.css']
})
export class ViewListingComponent implements OnInit {

	private propID: string;
	private sub: any;


  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
       this.propID = params.propertyId;
  	});
	}
}
