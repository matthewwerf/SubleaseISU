import { Injectable } from '@angular/core';

import { CanActivate, Router } from "@angular/router";
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

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
			console.log("Again");
			return true;
		}
		else {
			console.log("Help");
			this.router.navigate(['login']);
			return false;
		}
	}

	isLoggedIn(): boolean {//Observable<boolean> {
		// If there exists a username and cookie in the local storage
		if(localStorage.getItem('username') && localStorage.getItem('subleaseISUcookie')) {
			//Post to the server to see if it is valid
			this.http.post('/users/'+ localStorage.getItem('username'), {
				username: localStorage.getItem('username'),
				subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
			}).map(res => {
				// If no errors, return true
				if(!res['error']) {
					console.log("You're logged in");
					return true;
					//return Observable.of(false);
				}
				// otherwise please log-in
				else {
					console.log('Please log in');
					return false;
					//return Observable.of(false);
				}
			}).catch( () => {return Observable.of(false)});
		}
		return false;
		//return Observable.of(false);
	}
}
