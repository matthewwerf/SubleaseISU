import { Component, OnInit } from '@angular/core';
import { messageInfo } from '../models/messageInfo';
import { Headers, Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class MessagingService {

  constructor(private http: Http) { }


  getConversations(): Observable<messageInfo[]> {
  	// Get the json data string
  	return this.http.post('/messages/getUsernamesOfSenders', {
  		username: localStorage.getItem('username'),
		subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
  	}).map(res => {
        return res.json().map(item => {
          return new messageInfo( // Create new message objects
            item.senderUsername,
            item.receiverUsername,
            item.message,
            item.lastMessage);
        });
      });
  }

      private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}