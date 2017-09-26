import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-in-component',
  templateUrl: './log-in-component.component.html',
  styleUrls: ['./log-in-component.component.css']
})
export class LogInComponentComponent {
	

	onSubmit(form: any): void{
		console.log('User Info:', form);
	}
}