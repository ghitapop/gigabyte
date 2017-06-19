import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from '../../home/home.component'
import { ErrorComponent } from '../../error/error.component';
import {BlogDetailComponent} from "../../blog/blog-detail.component";
import {CommonService} from "../services/common.service";

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'post/:id', component: BlogDetailComponent},
      { path: '', component: HomeComponent },
      { path: '**', component: ErrorComponent }
    ])
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    BlogDetailComponent
  ],
  providers: [
    CommonService
  ]
})
export class AppRoutingModule { }
