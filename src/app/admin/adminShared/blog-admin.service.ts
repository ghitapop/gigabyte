import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Blog} from "./model/blog";

@Injectable()
export class BlogAdminService {

  constructor() { }

  createPost(post: Blog, callback: any) {
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child('image/' + post.imgTitle).putString(post.img, 'base64');

    uploadTask.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          //console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          //console.log('Upload is running');
          break;
        }
      }, function(error) {
        console.log(error.message);
    }, function() {
      let url = uploadTask.snapshot.downloadURL[0];
      let dbRef = firebase.database().ref('blogPosts/');
      let newPost = dbRef.push();
      newPost.set({
        title: post.title,
        content: post.content,
        imgTitle: post.imgTitle,
        img: url,
        id: newPost.key
      }); 
      callback();   
    });
  }
}
