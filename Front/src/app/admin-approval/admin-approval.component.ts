import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../models/userInfo';
import { Headers, Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-admin-approval',
  templateUrl: './admin-approval.component.html',
  styleUrls: ['./admin-approval.component.css']
})
export class AdminApprovalComponent implements OnInit {

	userList: UserInfo[];
	isLoaded: boolean;

  	constructor(private http: Http) { }

  	ngOnInit() {
  		this.isLoaded = false;
  		this.getUsers().subscribe(res => {
  			this.userList = res;
  			this.isLoaded = true;
  		});
  	}


  	getUsers(): Observable<UserInfo[]> {
  		return this.http.post('/getApprovals', {
  			username: localStorage.getItem('username'),
			subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
  		}).map(res => {
  			return res.json().map(item => {
  				return new UserInfo(
  					item.username,
  					item.email,
  					item.phoneNumber,
  					null,
  					null,
  					item.userType,
  					item.userTypeApproved);
  			});
  		});
  	}

  	onClick(user: UserInfo, approve: boolean) {
  		this.http.post('approve/' + user, {
  			username: localStorage.getItem('username'),
			subleaseISUcookie: localStorage.getItem('subleaseISUcookie'),
  			approvalBoolean: approve
  		}).subscribe(res => {
  			if(!res['error']) {
  				window.alert("User permissions Updated.")
  			}
  			else {
  				window.alert("There was an error in updating user permissions.")
  			}
  		})
  	}

}
