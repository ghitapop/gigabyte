import { Component, OnInit } from '@angular/core';
import {ShoppingCartService} from "../shared/services/shopping-cart.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  myCart: any[];
  cartTotal: number;

  constructor(private shoppingCartService: ShoppingCartService, private router: Router) { }

  ngOnInit() {
    this.shoppingCartService.getCart()
      .then(theCart => this.myCart = theCart)
      .then(cart => this.sumCart(cart))
      .then(sum => this.cartTotal = sum);
  }

  private sumCart(cart: any) {
    return Promise.resolve(cart.reduce((total: number, item: any) => total + item.price, 0));
  }

  removeCart(id: string) {
    this.shoppingCartService.removeCart(id);
    this.sumCart(this.myCart).then(sum => this.cartTotal = sum);
  }

  purchase() {
    alert("Your Order Totaled: " + this.cartTotal);
    this.router.navigate(['/shop']);
  }

  cancel() {
    this.router.navigate(['/shop']);
  }

}
