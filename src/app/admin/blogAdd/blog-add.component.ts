import { Component, OnInit } from '@angular/core';
import { Blog } from "app/admin/adminShared/model/blog";
import { Router } from "@angular/router";
import { BlogAdminService } from "app/admin/adminShared/blog-admin.service";

@Component({
    selector: 'add-menu',
    templateUrl: './blog-add.component.html',
    styleUrls: ['./blog-add.component.scss']
})

export class BlogAddComponent {
    imgTitle: string;
    imageSrc: string;
    postTitle: string;
    content: string;
    post: Blog;

    constructor(private blogAdminService: BlogAdminService, private router: Router) { }

    fileLoad($event: any) {
        let myReader: FileReader = new FileReader();
        let file: File = $event.target.files[0];
        this.imgTitle = file.name;
        myReader.readAsDataURL(file);

        myReader.onload = (e: any) => {
            this.imageSrc = e.target.result;
        }
    }

    createPost() {
        this.post = new Blog(
            this.postTitle,
            this.content,
            this.imgTitle,
            this.imageSrc.substring(23)
        );

        let message = '';
        this.blogAdminService.createPost(this.post, () => this.createPostCallback(message));
    }

    private createPostCallback(message: string) {
      this.router.navigate(['/admin']).then(value => {
        alert(message);
      });

    }

    cancel() {
        this.router.navigate(['/admin']);
    }

}
