//import { Component, OnInit } from '@angular/core';
//import { UserInfo } from '../models/userInfo';
import { HttpClient, HttpHeaders } from "@angular/common/http";
//import { Headers, Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ProfilePictureGrabService {

  constructor(private http: HttpClient) { }
 
  currUser: string = localStorage.getItem('username');
  requestString: string = '/retrieveProfilePicture/' + this.currUser;
  
  getProfilePic(){
    console.log(this.requestString);
    // Get the json data string
    return this.http.post( this.requestString , {
      username: localStorage.getItem('username'),
      subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
    },
    {
      responseType: 'blob'
    }
    
      
    ).map(data => {
      
      //console.log(data);
      return data;  
       
    });
  }
      private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}