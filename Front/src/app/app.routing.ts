import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MyNewComponentComponent }   from './my-new-component/my-new-component.component';
import { LogInComponentComponent} from './log-in-component/log-in-component.component';
import { PageNotFoundComponent} from './page-not-found/page-not-found.component';
import { SignUpComponent} from './sign-up/sign-up.component';
import { CreatePropertyComponent } from './create-property/create-property.component';


// This is the router module where you add routes to components (Pages)
export const ROUTES: Routes = [
    {
        path: 'home', 
        component: HomeComponent
    },
    {
        path: 'new', 
        component: MyNewComponentComponent
    },
    {
        path: 'createproperty', 
        component: CreatePropertyComponent,
        data:{title: 'Create Property'}
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