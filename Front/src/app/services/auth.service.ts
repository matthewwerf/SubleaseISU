import { Injectable } from '@angular/core';

import { CanActivate, Router } from "@angular/router";
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { User } from '../models/user';

@Injectable()
export class AuthService implements CanActivate {
	private BASE_URL: string = 'proj-309-sd-b-1.cs.iastate.edu:8080';
	private headers: Headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http, private router: Router) {

	}

	canActivate() {
		console.log("Checking User Authentication");
		if(this.isLoggedIn()) {
			return true;
		}
		else {
			this.router.navigate(['login']);
			return false;
		}
	}

	isLoggedIn() {
		// If there exists a username and cookie in the local storage
		if(localStorage.getItem('username') && localStorage.getItem('subleaseISUcookie')) {
			//Post to the server to see if it is valid
			var url = '/users/' + localStorage.getItem('username');
			this.http.post(url, {
				username: localStorage.getItem('username'),
				subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
			}).subscribe(res => {
				// If no errors, return true
				if(!res['error']) {
					return true;
				}
				// otherwise please log-in
				else {
					console.log('Please log in');
					return false;
				}
			});
		}
		return false;
	}
}
