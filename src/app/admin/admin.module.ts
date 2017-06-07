import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SignUpComponent } from './signUp/sign-up.component';
import { LoginComponent } from './login/login.component';
import { AdminMenuComponent } from './adminMenu/admin-menu.component';

import { AdminComponent } from './adminComponent/admin.component';
import { UserService } from './adminShared/user.service';
import {BlogAdminService} from "./adminShared/blog-admin.service";


const AdminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {path: 'login', component: LoginComponent},
      {path: 'signup', component: SignUpComponent},
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
    RouterModule
  ],
  declarations: [
    AdminComponent,
    SignUpComponent,
    LoginComponent,
    AdminMenuComponent
  ],
  providers: [
    UserService,
    BlogAdminService
  ]
})
export class AdminModule { }
