import { Injectable } from '@angular/core';

import { CanActivate} from "@angular/router";
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { User } from '../models/user';

@Injectable()
export class AuthService implements CanActivate {
	private BASE_URL: string = 'proj-309-sd-b-1.cs.iastate.edu:8080';
	private headers: Headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http) {

	}

	canActivate() {
		console.log("AuthGuard");
		return true;
		// If there exists a username and cookie in the local storage
		// if(localStorage.getItem('username') && localStorage.getItem('subleaseISUcookie')) {
		// 	return true;
			// Post to the server to see if it is valid
			// this.http.post('/users', {
			// 	username: localStorage.getItem('username'),
			// 	subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
			// }).subscribe(res => {
			// 	// If no errors, return true
			// 	if(!res['error']) {
			// 		return true;
			// 	}
			// 	// otherwise please log-in
			// 	else {
			// 		console.log('Please log in');
			// 		return false;
			// 	}
			// });
		//}
	}
}
