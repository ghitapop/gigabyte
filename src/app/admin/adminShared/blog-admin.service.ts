import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Blog} from "./model/blog";

@Injectable()
export class BlogAdminService {

  constructor() { }

  createPost(createPost: Blog, callback: any) {
    let message;
    let storageRef = firebase.storage().ref();
    let imgKey = 'image/' + createPost.imgTitle;
    let uploadTask = storageRef.child(imgKey).putString(createPost.img, 'base64');

    uploadTask.on('state_changed', function(snapshot){
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
    }, function(error) {
        // Handle unsuccessful uploads
        switch (error.name) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            message = 'Unauthorized user';
            console.log(message);
            callback(message);
            break;

          case 'storage/canceled':
            // User canceled the upload
            message = 'User canceled the upload';
            console.log(message);
            callback(message);
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            message = 'Unknown error!';
            console.log('Unknown error! Error detail:' + error.message);
            callback(message);
            break;
        }
    }, function() {
        // Handle successful uploads on complete
        let url = uploadTask.snapshot.downloadURL;
        let dbRef = firebase.database().ref('blogPosts/');
        let newPost = dbRef.push();
        newPost.set({
          title: createPost.title,
          content: createPost.content,
          imgTitle: createPost.imgTitle,
          img: url,
          id: newPost.key
        });
        message = createPost.title + ' was created into the Store';
        callback(message);
    });
  }

  editPost(updatePost: Blog, callback: any) {
    let message;
    let dbRef = firebase.database().ref('blogPosts/').child(updatePost.id)
      .update({
        title: updatePost.title,
        content: updatePost.content
      });
      dbRef.then(()=> {
        //success
        message = updatePost.imgTitle + ' was updated in the Store';
        callback(message);
      }, (error)=> {
        //error
        console.log(error.message);
        message = 'Error = Unable to update ' + updatePost.title;
        callback(message);
      });
  }

  removePost(deletePost: Blog, callback: any) {
    let dbRef = firebase.database().ref('blogPosts/').child(deletePost.id).remove();
    let message;
    dbRef.then(()=> {
      //success
      firebase.storage().ref().child('image/' + deletePost.imgTitle)
        .delete().then(()=> {
            message = deletePost.title + ' and ' + deletePost.imgTitle + ' were deleted from Store';
            callback(message);
        }).catch((error) => {
            message = 'Error - Unable to delete ' + deletePost.imgTitle;
            console.log(error.message);
            callback(message);
        });
    }, (error)=> {
      //error
      message = 'Error - Unable to delete ' + deletePost.title;
      console.log(error.message);
      callback(message);
    });
  }
}



