import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { User } from '../User';


@Component({
  selector: 'app-sign-up-component',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
	signUpForm: FormGroup;

	ngOnInit() {
		this.signUpForm = new FormGroup ({
			username: new FormControl(),
			password: new FormControl(),
			phonenumber: new FormControl()
		});
	}
}

