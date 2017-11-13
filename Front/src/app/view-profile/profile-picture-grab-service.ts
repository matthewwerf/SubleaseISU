import { Component, OnInit } from '@angular/core';
//import { UserInfo } from '../models/userInfo';
import { Headers, Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';







@Injectable()
export class ProfilePictureGrabService {

  constructor(private http: Http) { }
 
  currUser: string = localStorage.getItem('username');

  requestString: string = '/retrieveProfilePic/' + this.currUser;
  getProfilePic(): Observable<any> {
    console.log(this.requestString);
  	// Get the json data string
  	return this.http.get( this.requestString , {
  		//username: localStorage.getItem('username'),
		//subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
  	}).map(res => {
      
        return res.json();
      });
  }
      private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}