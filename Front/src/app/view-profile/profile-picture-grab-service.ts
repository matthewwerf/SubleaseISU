import { Component, OnInit } from '@angular/core';
//import { HttpClient, HttpHeaders } from "@angular/common/http";
//import { Headers, Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Http, Headers, RequestOptions } from '@angular/http';
    @Injectable()
    export class ProfilePictureGrabService {
        headers: any;
        options: any
      constructor(private http: Http) {

           this.headers = new Headers({ 'Content-Type': 'text/plain' });
            this.options = new RequestOptions({ headers: this.headers }); 
         }

currUser: string = localStorage.getItem('username');

  requestString: string = '/retrieveProfilePicture/' + this.currUser;
  getProfilePic(): Observable<any> {
    console.log(this.requestString);
    // Get the json data string
    return this.http.post( this.requestString , {
        username: localStorage.getItem('username'),
        subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
    },this.options).map(res => {

        return res;
    });
  }

}
// @Injectable()
// export class ProfilePictureGrabService {

//   //private header = { headers: new HttpHeaders({ 'Content-Type': 'image' }) };
//   constructor(private http: HttpClient) { 
//     //this.headers = new Headers({ 'Content-Type': 'text/plain' });
//     //this.options = new RequestOptions({ headers: this.headers }); 
//   }
 
//   currUser: string = localStorage.getItem('username');

//   requestString: string = '/retrieveProfilePicture/' + this.currUser;
//   getProfilePic(){
//     console.log(this.requestString);
//   	// Get the json data string
//   	return this.http.post( this.requestString , {
//   		username: localStorage.getItem('username'),
// 		  subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
//   	},
//     {
//         headers: new HttpHeaders().set('Content-Type', 'text/plain'),
//         responseType: 'text' 
//     }).map(res => {
        
//         return res;
//       });
//   }
//   private handleError(error: any): Promise<any> {
//     console.error('An error occurred', error); // for demo purposes only
//     return Promise.reject(error.message || error);
//   }

// }