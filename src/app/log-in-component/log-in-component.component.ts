import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-in-component',
  templateUrl: './log-in-component.component.html',
  styleUrls: ['./log-in-component.component.css']
})
export class LogInComponentComponent {
	

	loginUser(e) {
		e.preventDefault();
		console.log(e)
		var username = e.target.element[0].value;
		var password = e.target.element[1].value;
		console.log(username, password);
		return false;
	}
}