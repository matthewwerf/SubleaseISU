import { Injectable } from '@angular/core';
import { messageInfo } from '../models/messageInfo';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import * as Rx from 'rxjs/Rx';
//import { environment } from '../environments/environment';

@Injectable()
export class WebSocketService {

	private socket;

  	constructor(private http: Http) { }

  	getChatByUser(user): Observable<messageInfo[]>{
  		return this.http.post('/messages/getHistory/' + user, {
  			username: localStorage.getItem('username'),
			subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
  		}).map(res => {
  			return res.json().map(item => {
  				return new messageInfo(
  					item.senderUsername,
  					item.receiverUsername,
  					item.message,
  					item.timeSent);
  			});
  		});
  	}
}
