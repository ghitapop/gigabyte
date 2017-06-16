import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { User } from '../adminShared/model/user';
import { Blog } from '../adminShared/model/blog';
import { UserService } from "../adminShared/user.service";
import { BlogAdminService } from "../adminShared/blog-admin.service";
import * as firebase from 'firebase';
import {Response} from "../adminShared/model/response";


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
    }

    getPosts() {
        let dbRef = firebase.database().ref('blogPosts/');
        dbRef.once('value')
            .then((snapshot) => {
                let tmp: string[] = snapshot.val();
                if(tmp) {
                  this.blogPosts = Object.keys(tmp).map(key => tmp[key]);
                }
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
      this.blogAdminService.editPost(single, this.updateCallback());
    }

    private updateCallback() {
      this.formDisplay = true;
      this.subscribeMessage();
    }

    deletePost(single: Blog) {
      let verify = confirm('Are you sure you want to delete this post?');
      if(verify == true) {
        this.blogAdminService.removePost(single, this.deletePostCallback());
      }
    }

    private deletePostCallback() {
      this.router.navigate(['/admin']).then(value => {
        this.subscribeMessage();
      });
    }

    private subscribeMessage() {
      this.blogAdminService.getResponse().subscribe((response: Response) => {
        if(response && response.message && response.message !== '') {
          this.displayMessage = true;
          this.response = response;
        }
      });
    }
}
