import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { User } from '../adminShared/model/user';
import { Blog } from '../adminShared/model/blog';
import { UserService } from "../adminShared/user.service";
import { BlogAdminService } from "../adminShared/blog-admin.service";
import * as firebase from 'firebase';


@Component({
    templateUrl: './blog-admin.component.html',
    styleUrls: ['./blog-admin.component.scss']
})

export class BlogAdminComponent implements OnInit {
    currentUser: User;
    menuChoice: string;
    blogPosts: Blog[];

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
                this.blogPosts = Object.keys(tmp).map(key => tmp[key]);
            });
    }
}