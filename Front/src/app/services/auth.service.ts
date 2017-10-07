import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { User } from '../models/user';

@Injectable()
export class AuthService {
	private BASE_URL: string = 'proj-309-sd-b-1.cs.iastate.edu:8080';
	private headers: Headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http) {

	}

	login(user: User): Promise<any> {
    	let url: string = `${this.BASE_URL}/login`;
    	return this.http.post(url, user, {headers: this.headers}).toPromise();
  	}
	
	register(user: User): Promise<any> {
    	let url: string = `${this.BASE_URL}/users`;
    	return this.http.post(url, user, {headers: this.headers}).toPromise();
  }
}
