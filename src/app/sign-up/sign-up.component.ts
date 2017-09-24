import { Component, OnInit } from '@angular/core';
import { User } from '../User';

@Component({
  selector: 'app-sign-up-component',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
	submitted = false;

  onSubmit() { this.submitted = true; }
}

