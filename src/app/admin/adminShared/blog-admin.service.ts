import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Blog} from "./model/blog";
import {Subject} from "rxjs/Subject";
import {Response} from "./model/response";
import {Observable} from "rxjs/Observable";
import { LoggerService } from '../../shared/services/logger.service';
import { Util } from '../../shared/utils/util';


@Injectable()
export class BlogAdminService {

  private response: Response;
  private subject: Subject<Response> = new Subject<Response>();
  private util: Util = new Util();

  constructor(private logger: LoggerService) { }

  private setResponse(response: Response): void {
    this.response = response;
    this.subject.next(response);
  }

  getResponse(): Observable<Response> {
    return this.subject.asObservable();
  }

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

  createPost(createPost: Blog) {
    let self = this;
    let responseToSubmit: Response;

    try {
      if(createPost.imgTitle !== '' && createPost.img !== '') {
        let storageRef = firebase.storage().ref();
        let imgKey = 'blog_images/' + createPost.imgTitle + '-' + self.util.generateUUID();
        let uploadTask = storageRef.child(imgKey).putString(createPost.img, 'base64');

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
                self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
                self.setResponse(responseToSubmit);
                break;

              case 'storage/canceled':
                // User canceled the upload
                responseToSubmit = new Response('User canceled the upload', '500');
                self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
                self.setResponse(responseToSubmit);
                break;

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                responseToSubmit = new Response('Unknown error', '500');
                self.logger.log.error('Unknown error! Error detail:' + error.message, responseToSubmit.messageCode, error);
                self.setResponse(responseToSubmit);
                break;
            }
        }, function() {
            // Handle successful uploads on complete
            let url = uploadTask.snapshot.downloadURL;
            responseToSubmit = self.savePost(createPost, url, self.logger);
            self.setResponse(responseToSubmit);
        });
      } else {
        responseToSubmit = self.savePost(createPost, null, self.logger);
        self.setResponse(responseToSubmit);

      }
    } catch(error) {
      responseToSubmit = new Response('Unknown error! Error detail:' + error.message, '500');
      self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
      self.setResponse(responseToSubmit);
    }
  }

  private savePost(createPost: Blog, url: string, logger: LoggerService) {
    let dbRef = firebase.database().ref('blogPosts/');
    let newPost = dbRef.push();
    newPost.set({
      title: createPost.title,
      content: createPost.content,
      imgTitle: createPost.imgTitle,
      img: url,
      id: newPost.key
    });
    let responseToSubmit = new Response(createPost.title + ' was created into the Store', '200');
    logger.log.debug(responseToSubmit.message, responseToSubmit.messageCode);
    return responseToSubmit;
  }

  editPost(updatePost: Blog) {
    let responseToSubmit: Response;
    let self = this;

    try{
      let dbRef = firebase.database().ref('blogPosts/').child(updatePost.id)
        .update({
          title: updatePost.title,
          content: updatePost.content
        });
        dbRef.then(()=> {
          //success
          responseToSubmit = new Response(updatePost.title + ' was updated in the Store', '200');
          self.logger.log.debug(responseToSubmit.message, responseToSubmit.messageCode);
          self.setResponse(responseToSubmit);
        }, (error)=> {
          //error
          responseToSubmit = new Response('Error = Unable to update ' + updatePost.title, '500');
          self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
          self.setResponse(responseToSubmit);
        });
      } catch(error) {
      responseToSubmit = new Response('Unknown error! Error detail:' + error.message, '500');
      self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
      self.setResponse(responseToSubmit);
    }
  }

  removePost(deletePost: Blog) {
    let self = this;
    let responseToSubmit: Response;
    try{
      let dbRef = firebase.database().ref('blogPosts/').child(deletePost.id).remove();
      dbRef.then(()=> {
        //success
        firebase.storage().ref().child('blog_images/' + deletePost.imgTitle)
          .delete().then(()=> {
              responseToSubmit = new Response(deletePost.title + ' and ' + deletePost.imgTitle + ' were deleted from Store', '200');
              self.logger.log.debug(responseToSubmit.message, responseToSubmit.messageCode);
              self.setResponse(responseToSubmit);
          }).catch((error) => {
              responseToSubmit = new Response('Error - Unable to delete ' + deletePost.imgTitle, '500');
              self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
              self.setResponse(responseToSubmit);
          });
      }, (error)=> {
        //error
        responseToSubmit = new Response('Error - Unable to delete ' + deletePost.title, '500');
        self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
        self.setResponse(responseToSubmit);
      });
    } catch(error) {
      responseToSubmit = new Response('Unknown error! Error detail:' + error.message, '500');
      self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
      self.setResponse(responseToSubmit);
    }
  }
}



