import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template: `
  
  <nav>
    <a routerLink="/home" routerLinkActive="active">Home</a>
    <a routerLink="/new" routerLinkActive="active">My Nw Component</a>
    <a routerLink="/login" routerLinkActive="active">Log In</a>
    <a routerLink="/signup" routerLinkActive="active">Sign Up</a>
    <a routerLink="/main" routerLinkActive="active">Main Page</a>
  </nav>
  <router-outlet></router-outlet>
`
})
export class AppComponent {
  title = 'app';
}
