import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { User } from '../../adminShared/model/user';
import { Blog } from '../../adminShared/model/blog';
import { UserService } from "../../adminShared/user.service";
import { BlogAdminService } from "../../adminShared/blog-admin.service";
import {Response} from "../../adminShared/model/response";


@Component({
    templateUrl: './blog-admin.component.html',
    styleUrls: ['./blog-admin.component.scss']
})

export class BlogAdminComponent implements OnInit {
    currentUser: User;
    menuChoice: string;
    blogPosts: Blog[];
    formDisplay: boolean = true;
    singlePost: Blog;
    displayMessage: boolean = false;
    response: Response;

    constructor(
        private userService: UserService,
        private router: Router,
        private blogAdminService: BlogAdminService
    ) {}

    logout() {
        this.userService.logout(() => this.router.navigate(['']));
    }

    chooseMode(mode) {
        this.menuChoice = mode;
    }

    ngOnInit() {
        this.currentUser = this.userService.loggedInUser;
        this.getPosts();

        this.blogAdminService.getResponse().subscribe((response: Response) => {
        switch (response.messageCode) {
            case '200':
                this.response = response;
                this.router.navigate(['/admin']);
                break;

            case '500':
                this.response = response;
                this.displayMessage = true;
                break;

            default:
                break;
        }
      });
    }

    getPosts() {
        this.blogAdminService.getPosts().then(items => {
          this.blogPosts = items;
        });
    }

    editPost(thePost: Blog) {
      this.singlePost = thePost;
      this.formDisplay = false;
    }

    cancelEdit() {
      this.formDisplay = true;
    }

    updatePost(single: Blog) {
      this.blogAdminService.editPost(single);
    }

    deletePost(single: Blog) {
      let verify = confirm('Are you sure you want to delete this post?');
      if(verify == true) {
        this.blogAdminService.removePost(single);
      }
    }
}
