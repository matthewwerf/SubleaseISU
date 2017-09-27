import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { User } from '../User';


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
    	console.log("Form Submitted!");
    	this.signUpForm.reset();
  	}
}
}

