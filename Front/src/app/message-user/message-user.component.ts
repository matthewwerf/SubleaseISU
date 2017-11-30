import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { messageInfo } from '../models/messageInfo';
import { WebSocketService } from '../services/web-socket.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as io from "socket.io-client";


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
  private socket;
  private textMessage: FormControl;
  private newMessageForm: FormGroup;

  	constructor(private route: ActivatedRoute, private http: Http, private webSocketService: WebSocketService) { }

  	ngOnInit() {
      // Connect the socket
      this.socket = io.connect('/');
  		this.isLoaded = false;

      // Get the info for the users and get the chat history
  		this.sub = this.route.params.subscribe(params => {
       		this.username = params.senderUsername;
          this.currentUser = localStorage.getItem('username');
          this.webSocketService.getChatByUser(this.username).subscribe(messages => {
          this.messageHistory = messages;
          });
       		this.isLoaded = true;

           // Create an event listener for receiving messages
          this.socket.on('server-distribute-message', function (data) {
            console.log(data);
            if(data.senderUsername === this.currentUser || data.receiverUsername === this.currentUser) {
              var tempMessageInfoObject = new messageInfo(data.senderUsername, data.receiverUsername, data.message, data.timeSent);
              this.messageHistory.push(tempMessageInfoObject);
              }
            }.bind(this));
  	  });

      // Create the form used to send messages
      this.createFormControls();
      this.createForm();


  	}

    createFormControls() {
      this.textMessage = new FormControl('');
    }

    createForm() {
    this.newMessageForm = new FormGroup ({
        textMessage: this.textMessage,
     });
    }

    onSubmit(form: any): void{
      if(this.textMessage.value != '') {
        // Create json object to be sent
        var messageToBeSent = {message: this.textMessage.value, senderUsername: this.currentUser, receiverUsername: this.username};
        this.socket.emit('new-message-to-server', JSON.stringify(messageToBeSent));
        this.newMessageForm.reset(); // Clear the chat box
      }
     }
   }

