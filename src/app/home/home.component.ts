import { Component, OnInit } from '@angular/core';
import {UserService} from "../admin/adminShared/user.service";
import {Router} from "@angular/router";
import {Blog} from "../admin/adminShared/model/blog";
import {CommonService} from "../shared/services/common.service";

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  blogPosts: Blog[];

  constructor(private userService: UserService, private commonService: CommonService, private router: Router) {}

  ngOnInit() {
    this.getPosts();
  }

  getPosts() {
      this.commonService.getPosts().then(items => {
        this.blogPosts = items;
      });
  }

  choosePost(post: Blog) {
    this.router.navigate(['/post', post.id]);
  }

}
