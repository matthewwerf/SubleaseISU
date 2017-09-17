import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template: `
  <h1>SubleaseISU</h1>
  <nav>
  	<a routerLink="/home" routerLinkActive="active">Home</a>
    <a routerLink="/new" routerLinkActive="active">My New Component</a>
    <a routerLink="/link" routerLinkActive="active">Link Test</a>
    <a routerLink="/login" routerLinkActive="active">Login</a>
  </nav>
  <router-outlet></router-outlet>
`
})
export class AppComponent {
  title = 'app';
}
