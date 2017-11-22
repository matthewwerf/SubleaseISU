import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../models/userInfo';
import { HttpClient, HttpHeaders } from "@angular/common/http";
//import { Headers, Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';





//: Observable<UserInfo>

@Injectable()
export class UserInfoService {

  constructor(private http: HttpClient) { }
 
  currUser: string = localStorage.getItem('username');

  requestString: string = '/users/' + this.currUser;
  getUserInfo(){
    console.log(this.requestString);
  	// Get the json data string
  	return this.http.get<UserInfo>( this.requestString , {
  		//username: localStorage.getItem('username'),
		//subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
  	}).map(res => {
      
        console.log(res);
        
          return new UserInfo( // Create new listing objects
          res.username,
          res.email,
          res.phoneNumber,
          res.venmoUsername,
          res.paypalUsername);  
      });
  }
      private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}