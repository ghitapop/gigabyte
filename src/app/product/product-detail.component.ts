import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CommonService} from "../shared/services/common.service";
import {Product} from "../admin/adminShared/model/product";
import {ShoppingCartService} from "../shared/services/shopping-cart.service";

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  singleProd: Product;
  displayMessage: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private commonSevice: CommonService, private shoppingCardService: ShoppingCartService) { }

  ngOnInit() {
    let productId = this.route.snapshot.params['id'];
    this.getSingle(productId);
  }

  private getSingle(prodId: string) {
    this.commonSevice.getProduct(prodId).then((response) => {
      this.singleProd = response;
    }, (error) => {
      //todo log the error and display to the user
    });
  }

  addProduct(id: string, name: string, price: number) {
    this.shoppingCardService.addProductToCart(id, name, price);
    this.displayMessage = true;
  }
}
