import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { User } from '../../adminShared/model/user';
import { UserService } from "../../adminShared/user.service";
import {Response} from "../../adminShared/model/response";
import {Product} from "../../adminShared/model/product";
import {ProductAdminService} from "../../adminShared/product-admin.service";


@Component({
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.scss']
})

export class ProductAdminComponent implements OnInit {
  currentUser: User;
  menuChoice: string;
  products: Product[];
  formDisplay: boolean = true;
  singleProd: Product;
  displayMessage: boolean = false;
  response: Response;

  constructor(
    private userService: UserService,
    private router: Router,
    private productAdminService: ProductAdminService
  ) {}

  logout() {
    this.userService.logout(() => this.router.navigate(['']));
  }

  chooseMode(mode) {
    this.menuChoice = mode;
  }

  ngOnInit() {
    this.currentUser = this.userService.loggedInUser;
    this.getProducts();

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

  getProducts() {
    this.productAdminService.getProducts().then(items => {
      this.products = items;
    });
  }

  editProduct(item: Product) {
    this.singleProd = item;
    this.formDisplay = false;
  }

  cancelEdit() {
    this.formDisplay = true;
  }

  updateProduct(single: Product) {
    this.productAdminService.editProduct(single);
  }

  deleteProduct(item: Product) {
    let verify = confirm('Are you sure you want to delete this product?');
    if(verify == true) {
      this.productAdminService.removeProduct(item);
    }
  }
}
