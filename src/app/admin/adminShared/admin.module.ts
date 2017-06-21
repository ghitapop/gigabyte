import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SignUpComponent } from '../signUp/sign-up.component';
import { LoginComponent } from '../login/login.component';
import { AdminMenuComponent } from '../adminMenu/admin-menu.component';

import { AdminComponent } from '../adminComponent/admin.component';
import { UserService } from './user.service';
import {BlogAdminService} from "./blog-admin.service";
import { BlogAdminComponent } from "../blog/blogAdmin/blog-admin.component";
import { BlogAddComponent } from "app/admin/blog/blogAdd/blog-add.component";
import {TruncatePipe} from './trunc.pipe';
import {ProductAdminService} from "./product-admin.service";
import {ProductAdminComponent} from "../product/productAdmin/product-admin.component";
import {ProductAddComponent} from "../product/productAdd/product-add.component";



const AdminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {path: 'login', component: LoginComponent},
      {path: 'signup', component: SignUpComponent},
      {path: 'product-admin', component: ProductAdminComponent, canActivate: [UserService]},
      {path: 'blog-admin', component: BlogAdminComponent, canActivate: [UserService]},
      {path: '', component: AdminMenuComponent, canActivate: [UserService]}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(AdminRoutes)
  ],
  exports: [
    RouterModule, TruncatePipe
  ],
  declarations: [
    AdminComponent,
    SignUpComponent,
    LoginComponent,
    AdminMenuComponent,
    BlogAdminComponent,
    BlogAddComponent,
    TruncatePipe,
    ProductAdminComponent,
    ProductAddComponent
  ],
  providers: [
    UserService,
    BlogAdminService,
    ProductAdminService
  ]
})
export class AdminModule { }
