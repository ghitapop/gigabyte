import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {CommonService} from "../shared/services/common.service";
import {Product} from "../admin/adminShared/model/product";
import {UserService} from "../admin/adminShared/user.service";

@Component({
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: Product[];

  constructor(private userService: UserService, private commonService: CommonService, private router: Router) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
      this.commonService.getProducts().then(items => {
        this.products = items;
      });
  }

  chooseProduct(prod: Product) {
    this.router.navigate(['/product', prod.id]);
  }

}
