import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Subject} from "rxjs/Subject";
import {Response} from "./model/response";
import {Observable} from "rxjs/Observable";
import { LoggerService } from '../../shared/services/logger.service';
import { Util } from '../../shared/utils/util';
import {Product} from "./model/product";


@Injectable()
export class ProductAdminService {

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

  createProduct(prod: Product) {
    let self = this;
    let responseToSubmit: Response;

    try {
      let storageRef = firebase.storage().ref();
      let imgKey = 'product_images/' + prod.imgTitle + '-' + self.util.generateUUID();
      let uploadTask = storageRef.child(imgKey).putString(prod.img, 'base64');
      prod.imgKey = imgKey;

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
        responseToSubmit = self.saveProduct(prod, url, self.logger);
        self.setResponse(responseToSubmit);
      });
    } catch(error) {
      responseToSubmit = new Response('Unknown error! Error detail:' + error.message, '500');
      self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
      self.setResponse(responseToSubmit);
    }
  }

  private saveProduct(prod: Product, url: string, logger: LoggerService) {
    let dbRef = firebase.database().ref('products/');
    let newProd = dbRef.push();
    newProd.set({
      name: prod.name,
      description: prod.description,
      imgTitle: prod.imgTitle,
      img: url,
      imgKey: prod.imgKey,
      price: prod.price,
      id: newProd.key
    });
    let responseToSubmit = new Response(prod.name + ' was created into the Store', '200');
    logger.log.debug(responseToSubmit.message, responseToSubmit.messageCode);
    return responseToSubmit;
  }

  editProduct(updateProd: Product) {
    let responseToSubmit: Response;
    let self = this;

    try{
      let dbRef = firebase.database().ref('products/').child(updateProd.id)
        .update({
          name: updateProd.name,
          description: updateProd.description,
          price: updateProd.price
        });
      dbRef.then(()=> {
        //success
        responseToSubmit = new Response(updateProd.name + ' was updated in the Store', '200');
        self.logger.log.debug(responseToSubmit.message, responseToSubmit.messageCode);
        self.setResponse(responseToSubmit);
      }, (error)=> {
        //error
        responseToSubmit = new Response('Error = Unable to update ' + updateProd.name, '500');
        self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
        self.setResponse(responseToSubmit);
      });
    } catch(error) {
      responseToSubmit = new Response('Unknown error! Error detail:' + error.message, '500');
      self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
      self.setResponse(responseToSubmit);
    }
  }

  removeProduct(deleteProd: Product) {
    let self = this;
    let responseToSubmit: Response;
    try{
      let dbRef = firebase.database().ref('products/').child(deleteProd.id).remove();
      dbRef.then(()=> {
        //success
        firebase.storage().ref().child('product_images/' + deleteProd.imgTitle)
          .delete().then(()=> {
          responseToSubmit = new Response(deleteProd.name + ' and ' + deleteProd.imgTitle + ' were deleted from Store', '200');
          self.logger.log.debug(responseToSubmit.message, responseToSubmit.messageCode);
          self.setResponse(responseToSubmit);
        }).catch((error) => {
          responseToSubmit = new Response('Error - Unable to delete ' + deleteProd.imgTitle, '500');
          self.logger.log.error(responseToSubmit.message, responseToSubmit.messageCode, error);
          self.setResponse(responseToSubmit);
        });
      }, (error)=> {
        //error
        responseToSubmit = new Response('Error - Unable to delete ' + deleteProd.name, '500');
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



