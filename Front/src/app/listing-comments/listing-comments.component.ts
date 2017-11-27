import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CommentInfo } from '../models/commentInfo';
import { Headers, Http } from '@angular/http';

@Component({
  selector: 'app-listing-comments',
  templateUrl: './listing-comments.component.html',
  styleUrls: ['./listing-comments.component.css']
})
export class ListingCommentsComponent implements OnInit {

  private propID: string;
  private address: string;
  private commentBody: string;
  private time: string;
  private newComment: CommentInfo;
  private isLoaded: boolean;
  private subscription: any;
  private commentArray: Array<CommentInfo>;

  constructor(private route: ActivatedRoute, private http: Http) { }

  comment(){
  	this.commentBody = (<HTMLInputElement>document.getElementById("comment")).value;
  	this.time = (new Date().toLocaleDateString()) + " " +(new Date().toLocaleTimeString());
  	this.newComment = new CommentInfo(localStorage.getItem('username'), this.time, this.commentBody);
  	this.commentArray.push(this.newComment);
  	console.log(this.commentArray);
  	(<HTMLInputElement>document.getElementById("comment")).value = "";
  	
  }

  ngOnInit() {
  	this.commentArray = [];
  	this.isLoaded = false;
  	this.subscription = this.route.params.subscribe(params => {
  		this.propID = params.propertyId;
  		this.address = params.address;
  	});
  }


}
