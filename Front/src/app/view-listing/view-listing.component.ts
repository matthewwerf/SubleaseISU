import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ListingInfo } from '../models/listing';
//import { Headers, Http } from '@angular/http';
import { CommentInfo } from '../models/commentInfo';
import { HttpClient, HttpHeaders } from "@angular/common/http";

const URL = '/propertyComment/';
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
  //private address: string;
  private commentBody: string;
  private time: string;
  private newComment: CommentInfo;
  private isLoaded2: boolean;
  //private subscription: any;
  private commentArray: Array<CommentInfo>;
  private URL2: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.commentArray = [];

  	this.isLoaded = false;
  	this.sub = this.route.params.subscribe(params => {
       this.propID = params.propertyId;
  	});

  	this.getListing().subscribe(listing => {
  		this.currentListing = listing;
      this.commentArray = listing.comments;
  		this.isLoaded = true;
  	});


	}

  comment(){
    this.commentBody = (<HTMLInputElement>document.getElementById("comment")).value;
    this.time = (new Date().toLocaleDateString()) + " " +(new Date().toLocaleTimeString());
    this.newComment = new CommentInfo(localStorage.getItem('username'), this.time, this.commentBody);
    //this.commentArray.push(this.newComment);
    this.URL2 = URL + this.propID;
    console.log(this.newComment);
    this.http.post(this.URL2, {
      username: localStorage.getItem('username'),
      subleaseISUcookie: localStorage.getItem('subleaseISUcookie'), 
      message: this.commentBody
    }).subscribe(
              res => {
                  //console.log(res);
                   if(!res['error']){
            console.log("no error");
            
          } else {
            console.log(res['error']);
          }
             //this.router.navigate(['login']);
              },
              err => {
              console.log("there was an error");
          console.log(err);
              }
            );
    (<HTMLInputElement>document.getElementById("comment")).value = "";
    
  }

  // getComments(): Observable<CommentInfo> {
  //   return this.http.post<CommentInfo>('/property/' + this.propID, {
  //     username: localStorage.getItem('username'),
  //   subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
  //   }).map(res => {
  //     return 
  //   })
  // }
	getListing(): Observable<ListingInfo> {
  	// Get the json data string
  	return this.http.put<ListingInfo>('/property/' + this.propID, {
  		username: localStorage.getItem('username'),
		subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
  	}).map(res => {
      console.log(res);
  		return new ListingInfo(
             res._id,
             res.posterUsername,
             res.leasingAgency,
             res.rentValue,
             res.address,
             res.postingMessage,
             res.propertyId,
             res.bathroomQuantity,
             res.roommateQuantity,
             res.personalBathroom,
             res.comments
             );
      });
  }
}
