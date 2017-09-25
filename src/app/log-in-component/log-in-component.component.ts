import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { User } from '../User';

@Component({
  selector: 'app-log-in-component',
  templateUrl: './log-in-component.component.html',
  styleUrls: ['./log-in-component.component.css']
})
export class LogInComponentComponent implements OnInit{
	
	logInForm: FormGroup;

  title: string = 'Google Maps';
  lat: number = 51.678418;
  lng: number = 7.809007;

  ngOnInit() {
      this.logInForm = new FormGroup ({
      username: new FormControl(),
      password: new FormControl(),
    });
  }
}