import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Ng4FilesModule } from 'angular4-files-upload/src/app/ng4-files';

import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './home/home.component';
import { LogInComponentComponent} from './log-in-component/log-in-component.component';
import { MainPageComponent } from './main-page/main-page.component';
import { PageNotFoundComponent} from './page-not-found/page-not-found.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import { Router } from './app.routing';
import { CreatePropertyComponent } from './create-property/create-property.component';





@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, 
    LogInComponentComponent,
    PageNotFoundComponent,
    SignUpComponent,
    CreatePropertyComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    Router,
    Ng4FilesModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
