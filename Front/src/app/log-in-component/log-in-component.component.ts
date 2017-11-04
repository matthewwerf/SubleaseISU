import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from '../models/user';

import * as crypto from 'crypto-js';

@Component({
  selector: 'app-log-in-component',
  templateUrl: './log-in-component.component.html',
  styleUrls: ['./log-in-component.component.css']
})
export class LogInComponentComponent {

  signInForm: FormGroup;
  public Username: FormControl;
  Password: FormControl;

  user: User = new User();
  constructor(private auth: AuthService, private http: HttpClient, private router: Router) {

  }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createFormControls() {
    this.Username = new FormControl('', Validators.required);
    this.Password = new FormControl('', Validators.required);
  }

  createForm() {
    this.signInForm = new FormGroup ({
      Username: this.Username,
      Password: this.Password,
     });
  }

  onSubmit(form: any): void{
    if (this.signInForm.valid) {

        // Hash the password with SHA1
        var hashedPassword = crypto.SHA1(this.Password.value);
        
        // POST the user to the backend
  var link = '/login/' + this.Username.value;
  this.http.post(link, {
          username: this.Username.value,
          hashedPassword: hashedPassword.toString(),
        }).subscribe(
            res => {
		if(!res['error']){
			localStorage.setItem('subleaseISUcookie', res['subleaseISUcookie']);
			localStorage.setItem('username', this.Username.value);
      window.alert("Youre logged in");

		} else if(res['error'] == 'Username already exists'){
			console.log("Username already in use");
		} else {
			console.log(res['error']);
		}
		//console.log(res);
            	//this.router.navigate(['main']);
            },
            err => {
              console.log(err);
            }
        );
      }
    }
}

