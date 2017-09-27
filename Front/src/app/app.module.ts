import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MyNewComponentComponent } from './my-new-component/my-new-component.component';
import { HomeComponent } from './home/home.component';
import { LogInComponentComponent} from './log-in-component/log-in-component.component';
import { PageNotFoundComponent} from './page-not-found/page-not-found.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import { Router } from './app.routing';
import { FormTestComponent } from './form-test/form-test.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, 
    MyNewComponentComponent,
    LogInComponentComponent,
    PageNotFoundComponent,
    SignUpComponent,
    FormTestComponent,
    
  ],
  imports: [
    BrowserModule,
    Router,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
