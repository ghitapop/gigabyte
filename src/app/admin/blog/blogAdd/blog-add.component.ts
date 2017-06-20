import { Component, OnInit } from '@angular/core';
import { Blog } from "app/admin/adminShared/model/blog";
import { Router } from "@angular/router";
import { BlogAdminService } from "app/admin/adminShared/blog-admin.service";
import {Response} from "../../adminShared/model/response";

@Component({
    selector: 'blog-menu',
    templateUrl: './blog-add.component.html',
    styleUrls: ['./blog-add.component.scss']
})

export class BlogAddComponent  implements OnInit {
    imgTitle: string;
    imageSrc: string;
    postTitle: string;
    content: string;
    post: Blog;
    displayMessage: boolean = false;
    response: Response;

    constructor(private blogAdminService: BlogAdminService, private router: Router) { }

    ngOnInit() {
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

        this.blogAdminService.createPost(this.post);
    }

    cancel() {
        this.router.navigate(['/admin']);
    }

}
