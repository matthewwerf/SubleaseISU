import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LogInComponentComponent} from './log-in-component/log-in-component.component';
import { PageNotFoundComponent} from './page-not-found/page-not-found.component';
import { SignUpComponent} from './sign-up/sign-up.component';

import { GooglemapsComponent } from './googlemaps/googlemaps.component';
import { CreatePropertyComponent } from './create-property/create-property.component';
import { MainPageComponent } from './main-page/main-page.component';
import { AuthService } from './services/auth.service';





// This is the router module where you add routes to components (Pages)
export const ROUTES: Routes = [
    {
        path: 'home', 
        component: HomeComponent
    },
    {
        path: 'main',
        component: MainPageComponent,
        canActivate: [AuthService]
    },
    {
        path: 'createproperty', 
        component: CreatePropertyComponent,
        data:{title: 'Create Property'},
        canActivate: [AuthService]
    },
    {
        path: 'login', 
        component: LogInComponentComponent,
        data:{title: 'Log In'}
    },
    {
        path: 'signup', 
        component: SignUpComponent,
        data:{title: 'Sign Up'}
    },
    {
        path: 'googlemaps',
        component: GooglemapsComponent,
        canActivate: [AuthService]
    },
    {
    	path: '',
    	redirectTo: '/home',
    	pathMatch: 'full'
  	},
  	{ 
  		path: '**',
  		component: PageNotFoundComponent
  	}
];

@NgModule({
  imports: [ RouterModule.forRoot(ROUTES) ],
  exports: [ RouterModule ],
  providers: []
})
export class Router { }