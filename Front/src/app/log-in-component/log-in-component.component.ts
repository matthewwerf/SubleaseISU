import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

@Component({
  selector: 'app-log-in-component',
  templateUrl: './log-in-component.component.html',
  styleUrls: ['./log-in-component.component.css']
})
export class LogInComponentComponent {
	user: User = new User();
	constructor(private auth: AuthService) {

	}

	onSubmit(form: any): void{
    	this.auth.login(this.user).then((user) => {
    		localStorage.setItem('token', user.json().auth_token);
      		console.log(user.json());
    		}).catch((err) => {
      			console.log(err);
    		});
		}
}