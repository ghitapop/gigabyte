import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Blog} from "./model/blog";
import {Subject} from "rxjs/Subject";
import {Response} from "./model/response";
import {Observable} from "rxjs/Observable";
import { LoggerService } from '../../shared/services/logger.service';


@Injectable()
export class BlogAdminService {

  private response: Response;
  private subject: Subject<Response> = new Subject<Response>();

  constructor(private logger: LoggerService) { }

  private setResponse(response: Response): void {
    this.response = response;
    this.subject.next(response);
  }

  getResponse(): Observable<Response> {
    return this.subject.asObservable();
  }

  createPost(createPost: Blog, callback: any) {
    let responseToSubmit: Response;
    let storageRef = firebase.storage().ref();
    let imgKey = 'image/' + createPost.imgTitle;
    let uploadTask = storageRef.child(imgKey).putString(createPost.img, 'base64');
    let self = this;

    uploadTask.on('state_changed', function(snapshot){
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        self.logger.log.debug('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            self.logger.log.debug('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            self.logger.log.debug('Upload is running');
            break;
        }
    }, function(error) {
        // Handle unsuccessful uploads
        switch (error.name) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            responseToSubmit = new Response('Unauthorized user', '500');
            self.setResponse(responseToSubmit);
            self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
            callback();
            break;

          case 'storage/canceled':
            // User canceled the upload
            responseToSubmit = new Response('User canceled the upload', '500');
            self.setResponse(responseToSubmit);
            self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
            callback();
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            responseToSubmit = new Response('Unknown error', '500');
            self.setResponse(responseToSubmit);
            self.logger.log.error('Unknown error! Error detail:' + error.message, responseToSubmit.messageCode, error);
            callback();
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
        responseToSubmit = new Response(createPost.title + ' was created into the Store', '200');
        self.logger.log.debug(responseToSubmit.message, responseToSubmit.messageCode);
        self.setResponse(responseToSubmit);
        callback();

    });
  }

  editPost(updatePost: Blog, callback: any) {
    let responseToSubmit: Response;
    let self = this;

    let dbRef = firebase.database().ref('blogPosts/').child(updatePost.id)
      .update({
        title: updatePost.title,
        content: updatePost.content
      });
      dbRef.then(()=> {
        //success
        responseToSubmit = new Response(updatePost.imgTitle + ' was updated in the Store', '200');
        self.setResponse(responseToSubmit);
        self.logger.log.debug(responseToSubmit.message, responseToSubmit.messageCode);
        callback();
      }, (error)=> {
        //error
        responseToSubmit = new Response('Error = Unable to update ' + updatePost.title, '500');
        self.setResponse(responseToSubmit);
        self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
        callback();
      });
  }

  removePost(deletePost: Blog, callback: any) {
    let self = this;
    let responseToSubmit: Response;
    let dbRef = firebase.database().ref('blogPosts/').child(deletePost.id).remove();
    dbRef.then(()=> {
      //success
      firebase.storage().ref().child('image/' + deletePost.imgTitle)
        .delete().then(()=> {
            responseToSubmit = new Response(deletePost.title + ' and ' + deletePost.imgTitle + ' were deleted from Store', '200');
            self.setResponse(responseToSubmit);
            self.logger.log.debug(responseToSubmit.message, responseToSubmit.messageCode);
            callback();
        }).catch((error) => {
            responseToSubmit = new Response('Error - Unable to delete ' + deletePost.imgTitle, '500');
            self.setResponse(responseToSubmit);
            self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
            callback();
        });
    }, (error)=> {
      //error
      responseToSubmit = new Response('Error - Unable to delete ' + deletePost.title, '500');
      self.setResponse(responseToSubmit);
      self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
      callback();
    });
  }
}



