import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { AppRoutingModule } from './shared/routes/app.routes';
import { AdminModule } from './admin/adminShared/admin.module';
import {LoggerService} from "./shared/services/logger.service";
import {Logger} from "angular2-logger/core";
import {ShopComponent} from "./shop/shop.component";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ErrorComponent,
    ShopComponent
  ],
  imports: [
    BrowserModule,
    AdminModule,
    AppRoutingModule
  ],
  providers: [
    LoggerService,
    Logger
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
