import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { HttpClient, HttpHeaders } from "@angular/common/http";
//import { Headers } from '@angular/http';

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
	accountType: FormControl;

	user: User;
	private header = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
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
		this.accountType = new FormControl();
	}

	createForm() {
		this.signUpForm = new FormGroup ({
			username: this.username,
			password: this.password,
			email: this.email,
			phonenumber: this.phonenumber,
			accountType: this.accountType
		});
	}

	onSubmit() {
  		if (this.signUpForm.valid) {
  			var regular = document.getElementById('accountChoice1') as HTMLInputElement;
  			var leasing = document.getElementById('accountChoice2') as HTMLInputElement;
  			var admin = document.getElementById('accountChoice3') as HTMLInputElement;

  			if(regular.checked) {
  				var tempAccountType = regular;
  			}
  			else if(leasing.checked) {
  				var tempAccountType = leasing;
  			}
  			else {
  				var tempAccountType = admin;
  			}

  			// Create the new user
  			this.user = new User(this.username.value, this.password.value, this.email.value, this.phonenumber.value, tempAccountType.value);

  			// Hash the password with SHA1
    		var hashedPassword = crypto.SHA1(this.password.value);

  			// POST the user to the backend

  			console.log(tempAccountType.value);
    		this.http.post('/users', {
	    		username: this.username.value,
				hashedPassword: hashedPassword.toString(),
				email: this.email.value,
				phoneNumber: this.phonenumber.value,
				userType: tempAccountType.value
		    }, this.header).subscribe(
		        res => {
		           	if(!res['error']) {
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


