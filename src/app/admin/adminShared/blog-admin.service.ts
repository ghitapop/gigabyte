import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Blog} from "./model/blog";

@Injectable()
export class BlogAdminService {

  constructor() { }

  createPost(post: Blog) {
    let storageRef = firebase.storage().ref();
    storageRef.child('image/${post.imgTitle}').putString(post.img, 'base64')
      .then((snapshot) => {
        let url = snapshot.metadata.downloadURLs[0];
        let dbRef = firebase.database().ref('blogPosts/');
        let newPost = dbRef.push();
        newPost.set({
          title: post.title,
          content: post.content,
          imgTitle: post.imgTitle,
          img: url,
          id: newPost.key
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

}
