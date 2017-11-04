import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../models/userInfo';
import { Headers, Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';







@Injectable()
export class UserInfoService {

  constructor(private http: Http) { }
 
  currUser: string = localStorage.getItem('username');
  requestString: string = '/users/' + this.currUser;
  getUserInfo(): Observable<UserInfo> {
  	// Get the json data string
  	return this.http.post( this.requestString , {
  		username: localStorage.getItem('username'),
		subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
  	}).map(res => {
        return res.json().map(item => {
          return new UserInfo( // Create new listing objects
            item.username,
            item.email,
            item.phoneNumber,
            item.venmoUsername,
            item.paypalUsername);  
            
        });
      });
  }

      private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}