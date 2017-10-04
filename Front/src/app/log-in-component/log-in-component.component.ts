 import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-log-in-component',
  templateUrl: './log-in-component.component.html',
  styleUrls: ['./log-in-component.component.css']
})

export class LogInComponentComponent{

	onSubmit(form: any): void{
		console.log('User Info:', form);
	}
}


