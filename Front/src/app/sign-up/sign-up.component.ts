import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

import * as crypto from 'crypto-js';


@Component({
  selector: 'app-sign-up-component',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
	signUpForm: FormGroup;
	username: FormControl;
	password: FormControl;
	email: FormControl;
	phonenumber: FormControl;

	user: User;
	constructor(private auth: AuthService, private http: HttpClient) {

	}

	ngOnInit() {
		this.createFormControls();
		this.createForm();
	}

	createFormControls() {
		this.username = new FormControl('', Validators.required);
		this.password = new FormControl('', [Validators.required, Validators.minLength(8)]);
		this.email = new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$")]);
		this.phonenumber = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
	}

	createForm() {
		this.signUpForm = new FormGroup ({
			username: this.username,
			password: this.password,
			email: this.email,
			phonenumber: this.phonenumber
		});
	}

	onSubmit() {
  		if (this.signUpForm.valid) {
  			// Create the new user
  			this.user = new User(this.username, this.password, this.email, this.phonenumber);

  			// Hash the password with SHA1
    		var hashedPassword = crypto.SHA1(this.password);
  			
  			// POST the user to the backend
    		const req = this.http.post('http://jsonplaceholder.typicode.com/posts', {
	    		username: this.username.value,
				password: hashedPassword.toString(),
				email: this.email.value,
				phonenumber: this.phonenumber.value
		    }).subscribe(
		        res => {
		          console.log(res);
		        },
		        err => {
		          console.log(err);
		        }
		      );

		    // Log in the user and save the data to the local storage
  			// this.auth.register(this.user).then((user) => {
     //  			localStorage.setItem('token', user.json().auth_token);
     //  			console.log(user.json());
    	// 	}).catch((err) => {
     //  			console.log(err);
    	// 	});
 			
 			// Reset the form
    		this.signUpForm.reset();
  		}
	}
}

