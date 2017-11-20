import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { messageInfo } from '../models/messageInfo';

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
	private username: string;
	private sub: any;


  	constructor(private route: ActivatedRoute, private http: Http) { }

  	ngOnInit() {
  		this.isLoaded = false;
  		this.sub = this.route.params.subscribe(params => {
       		this.username = params.senderUsername;
       		this.isLoaded = true;
  	});

  	}



}
