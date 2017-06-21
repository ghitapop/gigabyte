import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from '../../home/home.component'
import { ErrorComponent } from '../../error/error.component';
import {BlogDetailComponent} from "../../blog/blog-detail.component";
import {CommonService} from "../services/common.service";
import {ShopComponent} from "../../shop/shop.component";
import {ProductDetailComponent} from "../../product/product-detail.component";
import {CartComponent} from "../../cart/cart.component";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'cart', component: CartComponent},
      { path: 'product/:id', component: ProductDetailComponent},
      { path: 'shop', component: ShopComponent},
      { path: 'post/:id', component: BlogDetailComponent},
      { path: '', component: HomeComponent },
      { path: '**', component: ErrorComponent }
    ]),
    CommonModule
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    BlogDetailComponent,
    ProductDetailComponent
  ],
  providers: [
    CommonService
  ]
})
export class AppRoutingModule { }
