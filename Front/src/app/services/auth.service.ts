import { Injectable } from '@angular/core';

import { CanActivate, Router } from "@angular/router";
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


import { User } from '../models/user';

@Injectable()
export class AuthService implements CanActivate {

	constructor(private http: Http, private router: Router) {

	}

	canActivate(): Observable<boolean> | boolean {
		return this.http.post('/users/' + localStorage.getItem('username'), {
			username: localStorage.getItem('username'),
			subleaseISUcookie: localStorage.getItem('subleaseISUcookie')
		}).map(res => {
			if(!res['error']) {
				return true;
			}
			else {
				this.router.navigate(['login']);
				return false;
			}
		}).catch( (e) => {
			console.log(e);
			window.alert("Please log in.");
			this.router.navigate(['login']);
			return Observable.of(false);
		});
	}
}
