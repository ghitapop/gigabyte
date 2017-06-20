import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from '../../home/home.component'
import { ErrorComponent } from '../../error/error.component';
import {BlogDetailComponent} from "../../blog/blog-detail.component";
import {CommonService} from "../services/common.service";
import {ShopComponent} from "../../shop/shop.component";
import {ProductDetailComponent} from "../../product/product-detail.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'product/:id', component: ProductDetailComponent},
      { path: 'shop', component: ShopComponent},
      { path: 'post/:id', component: BlogDetailComponent},
      { path: '', component: HomeComponent },
      { path: '**', component: ErrorComponent }
    ])
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
