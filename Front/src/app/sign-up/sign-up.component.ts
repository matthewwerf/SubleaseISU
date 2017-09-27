import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';




@Component({
  selector: 'app-sign-up-component',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
	signUpForm: FormGroup;
	username: FormControl;
	password: FormControl;
	phonenumber: FormControl;
	

	ngOnInit() {
		this.createFormControls();
		this.createForm();
	}

	createFormControls() {
		this.username = new FormControl('', Validators.required);
		this.password = new FormControl('', [Validators.required, Validators.minLength(8)]);
		this.phonenumber = new FormControl('', [Validators.required, Validators.pattern("[^ @]*@[^ @]*")]);
	}

	createForm() {
		this.signUpForm = new FormGroup ({
			username: this.username,
			password: this.password,
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

