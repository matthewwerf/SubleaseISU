import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { MyNewComponentComponent } from './my-new-component/my-new-component.component';
import { HomeComponent } from './home/home.component';
import { LogInComponentComponent} from './log-in-component/log-in-component.component';
import { PageNotFoundComponent} from './page-not-found/page-not-found.component';

import { Router } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, 
    MyNewComponentComponent,
    LogInComponentComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    Router
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
