import { Injectable } from '@angular/core';
import {Blog} from "../../admin/adminShared/model/blog";
import * as firebase from 'firebase';

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

}
