import { Injectable } from '@angular/core';
import {Blog} from "../../admin/adminShared/model/blog";
import * as firebase from 'firebase';
import {Product} from "../../admin/adminShared/model/product";

@Injectable()
export class CommonService {
  constructor() { }

  getPosts() {
    let dbRef = firebase.database().ref('blogPosts/');
    return Promise.resolve(dbRef.once('value')
      .then((snapshot) => {
        let tmp: string[] = snapshot.val();
        let blogPosts = [];
        if(tmp) {
          blogPosts = Object.keys(tmp).map(key => tmp[key]);
        }
        return blogPosts;
      }));
  }

  getPost(id: string) {
    let dbRef = firebase.database().ref('blogPosts/');
    return Promise.resolve(dbRef.orderByChild('id')
      .equalTo(id)
      .once('value')
      .then((snapshot) => {
        let tmp: string[] = snapshot.val();
        let blogPosts = [];
        let singlePost: Blog;
        if(tmp) {
          blogPosts = Object.keys(tmp).map(key => tmp[key]);
          let title = blogPosts[0].title;
          let content = blogPosts[0].content;
          let imgTitle = blogPosts[0].imgTitle;
          let img = blogPosts[0].img;

          singlePost = new Blog(title, content, imgTitle, img);
        }

        return singlePost;
      })
    );
  }

  getProducts() {
    let dbRef = firebase.database().ref('products/');
    return Promise.resolve(dbRef.once('value')
      .then((snapshot) => {
        let tmp: string[] = snapshot.val();
        let products = [];
        if(tmp) {
          products = Object.keys(tmp).map(key => tmp[key]);
        }
        return products;
      }));
  }

  getProduct(id: string) {
    let dbRef = firebase.database().ref('products/');
    return Promise.resolve(dbRef.orderByChild('id')
      .equalTo(id)
      .once('value')
      .then((snapshot) => {
        let tmp: string[] = snapshot.val();
        let products = [];
        let singleProduct: Product;
        if(tmp) {
          products = Object.keys(tmp).map(key => tmp[key]);
          let name = products[0].name;
          let description = products[0].description;
          let imgTitle = products[0].imgTitle;
          let img = products[0].img;
          let price = products[0].price;
          let imgKey = products[0].imgKey;
          let id = products[0].id;

          singleProduct = new Product(name, description, imgTitle, img, price, imgKey, id);
        }

        return singleProduct;
      })
    );
  }

}
