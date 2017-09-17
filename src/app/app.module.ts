import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { MyNewComponentComponent } from './my-new-component/my-new-component.component';
import { HomeComponent } from './home/home.component';
import { LinkTestComponentComponent} from './link-test-component/link-test-component.component';
import { PageNotFoundComponent} from './page-not-found/page-not-found.component';
import { LoginComponentComponent } from './login-component/login-component.component';
import { Router } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, 
    MyNewComponentComponent,
    LinkTestComponentComponent,
    PageNotFoundComponent,
    LoginComponentComponent,
  ],
  imports: [
    BrowserModule,
    Router
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
