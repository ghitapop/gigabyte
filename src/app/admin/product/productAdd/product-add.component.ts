import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {Response} from "../../adminShared/model/response";
import {Product} from "../../adminShared/model/product";
import {ProductAdminService} from "../../adminShared/product-admin.service";

@Component({
  selector: 'product-menu',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})

export class ProductAddComponent  implements OnInit {
  name: string;
  description: string;
  imgTitle: string;
  imageSrc: string;
  price: number;
  product: Product;
  displayMessage: boolean = false;
  response: Response;

  constructor(private productAdminService: ProductAdminService, private router: Router) { }

  ngOnInit() {
    this.productAdminService.getResponse().subscribe((response: Response) => {

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

  createProduct() {
    this.product = new Product(
      this.name,
      this.description,
      this.imgTitle,
      this.imageSrc.substring(23),
      this.price
    );

    this.productAdminService.createProduct(this.product);
  }

  cancel() {
    this.router.navigate(['/admin']);
  }

}
