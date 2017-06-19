import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CommonService} from "../shared/services/common.service";
import {Blog} from "../admin/adminShared/model/blog";

@Component({
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  singlePost: Blog;

  constructor(private route: ActivatedRoute, private router: Router, private commonSevice: CommonService) { }

  ngOnInit() {
    let postId = this.route.snapshot.params['id'];
    this.getSingle(postId);
  }

  private getSingle(postId: string) {
    this.commonSevice.getPost(postId).then((response) => {
      this.singlePost = response;
    }, (error) => {
      //todo log the error and display to the user
    });
  }
}
