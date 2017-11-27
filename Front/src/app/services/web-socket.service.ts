import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
//import { environment } from '../environments/environment';

@Injectable()
export class WebSocketService {

	private socket;

  	constructor() { }


  	connect(): Rx.Subject<MessageEvent> {
  		this.socket = io(temp);

  		let observable = new Observable(observer => {
  			this.socket.on('message', (data) => {
  				console.log("Received message from socket");
  				observer.next(data);
  			})
  			return () => {
  				this.socket.disconnect();
  			}
  		});

  		let observer = {
  			next: (data:object) => {
  				this.socket.emit('message', JSON.stringify(data));
  			},
  		};

  		return Rx.Subject.create(observer, observable);
  	}
}
