import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Headers } from '@angular/http';

import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
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
	constructor(private auth: AuthService, private http: HttpClient, private router: Router) {

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
    		var hashedPassword = crypto.SHA1(this.password.value);
  			

		let headers = new Headers({'Content-Type' : 'application/json'});
  			// POST the user to the backend

    		this.http.post('/users', {
	    		username: this.username.value,
				hashedPassword: hashedPassword.toString(),
				email: this.email.value,
				phoneNumber: this.phonenumber.value
		    }, headers).subscribe(
		        res => {
		           	if(!res['error']){
						console.log("no error");
						localStorage.setItem('subleaseISUcookie', res['subleaseISUcookie'].value )
						this.router.navigate(['login']);
					} else {
						if(res['error'].status == '400') {
							console.log("Username is already in use");
							window.alert("Username is already in use, please select a new username.");
						}
						console.log(res['error']);
					}
		        },
		        err => {
		    		console.log("there was an error");
					console.log(err);
		        }
		      );
  		}
	}
}


