import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-log-in-component',
  templateUrl: './log-in-component.component.html',
  styleUrls: ['./log-in-component.component.css']
})
export class LogInComponentComponent {
	constructor(private auth: AuthService) {

	}

	ngOnInit(): void {
	}

	onSubmit(form: any): void{
		console.log('User Info:', form);
	}
}