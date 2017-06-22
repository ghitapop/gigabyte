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
import {ShoppingCartService} from "./shared/services/shopping-cart.service";
import { CartComponent } from './cart/cart.component';
import {BlogDetailComponent} from "./blog/blog-detail.component";
import {ProductDetailComponent} from "./product/product-detail.component";
import { PaymentComponent } from './payment/payment.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ErrorComponent,
    ShopComponent,
    CartComponent,
    BlogDetailComponent,
    ProductDetailComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    AdminModule,
    AppRoutingModule
  ],
  providers: [
    LoggerService,
    Logger,
    ShoppingCartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
