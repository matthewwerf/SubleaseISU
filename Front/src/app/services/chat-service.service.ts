import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class ChatServiceService {

  messages: Subject<any>;

   // constructor(private wsService: WebSocketService) {
   // 	this.messages = <Subject<any>>wsService.connect().map((response: any): any => {
   // 		return response;
   // 	})

   // }

   // sendMessage(msg) {
   // 	this.messages.next(msg);
   // }

}
