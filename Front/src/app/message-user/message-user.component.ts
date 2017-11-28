import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { messageInfo } from '../models/messageInfo';
import { WebSocketService } from '../services/web-socket.service';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-message-user',
  templateUrl: './message-user.component.html',
  styleUrls: ['./message-user.component.css']
})
export class MessageUserComponent implements OnInit {

	private isLoaded: boolean;
	private userInfo: messageInfo;
  private currentUser: string;
	private username: string;
	private sub: any;
  private messageHistory: messageInfo[];


  	constructor(private route: ActivatedRoute, private http: Http, private webSocketService: WebSocketService) { }

  	ngOnInit() {
  		this.isLoaded = false;
  		this.sub = this.route.params.subscribe(params => {
       		this.username = params.senderUsername;
          this.currentUser = localStorage.getItem('username');
          this.webSocketService.getChatByUser(this.username).subscribe(messages => {
            this.messageHistory = messages;
          });
       		this.isLoaded = true;
  	});

  	}



}
