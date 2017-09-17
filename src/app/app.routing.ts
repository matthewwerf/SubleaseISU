import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MyNewComponentComponent }   from './my-new-component/my-new-component.component';
import { LinkTestComponentComponent} from './link-test-component/link-test-component.component';
import { PageNotFoundComponent} from './page-not-found/page-not-found.component';

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
        path: 'link', 
        component: LinkTestComponentComponent,
        data: { title: 'Link Test'}
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