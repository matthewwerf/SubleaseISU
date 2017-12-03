import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ListingInfo } from '../models/listing';
//import { Headers, Http } from '@angular/http';
import { CommentInfo } from '../models/commentInfo';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Headers, Http, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  private commentArray: any;
  private avgRating: any;
  private commentBody: string;
  private time: any;
  private newComment: any;
  private URL2: any;
  private textMessage: FormControl;
  private newMessageForm: FormGroup;

  

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

    this.getAverage().subscribe(rating => {
      this.avgRating = <number>rating;
      console.log(this.avgRating);
      this.avgRating = Math.round(this.avgRating * 10)/10;
      if(this.avgRating == null)
      {
        //this.avgRating == 0;
      }
    });

  	  // Create the form used to send messages
      this.createFormControls();
      this.createForm();
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
            this.isLoaded = false;
            this.getListing().subscribe(listing => {
            this.currentListing = listing;
            this.commentArray = listing.comments;
            this.isLoaded = true;
    });
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

  getAverage(){
    console.log("test");
    return this.http.get<any>('/propertyRating/' + this.propID).map(res => {
      return res.avgRating;
    });
  }
    createFormControls() {
      this.textMessage = new FormControl('');
    }

    createForm() {
    this.newMessageForm = new FormGroup ({
        textMessage: this.textMessage,
     });
    }

    onSubmit(form: any): void{
      if(this.textMessage.value != '') {

        //var body = JSON.stringify();
        //console.log(body);
        this.http.post('/messages/saveHistory', {
          username: localStorage.getItem('username'),
          subleaseISUcookie: localStorage.getItem('subleaseISUcookie'),
          senderUsername: localStorage.getItem('username'),
          receiverUsername: this.currentListing.posterUsername,
          message: this.textMessage.value}
        ).subscribe(res => {
          if(!res['error']){
          window.alert("Message sent, you can see your messages in messages tab.");
          this.newMessageForm.reset(); // Clear the chat box
        }
        else {
          window.alert("There was an error in sending the message.");
        }
      });
      }
     }

	getListing(): Observable<ListingInfo> {
  	// Get the json data string
  	return this.http.put<ListingInfo>('/property/' + this.propID, {
  		username: localStorage.getItem('username'),
		subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
  	}).map(res => {
      //console.log(res);

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
