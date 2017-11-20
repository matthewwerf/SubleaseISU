import { Component, OnInit } from '@angular/core';
import { messageInfo } from '../models/messageInfo';
import { MessagingService } from './messaging-service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {


	conversations: messageInfo[];
	isLoaded: boolean;

	constructor(private messagingService: MessagingService) { }

	ngOnInit() {
		this.isLoaded = false;
		this.messagingService.getConversations().subscribe( data => {
			this.conversations = data;
			this.isLoaded = true;
		})


  }

}
