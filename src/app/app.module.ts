import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { MyNewComponentComponent } from './my-new-component/my-new-component.component';
import { HomeComponent } from './home/home.component';


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
    	path: '',
    	redirectTo: '/home',
    	pathMatch: 'full'
  	},
  	{ 
  		path: '**',
  		component: HomeComponent
  	}
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, 
    MyNewComponentComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES,  { enableTracing: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
