import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import * as firebase from 'firebase';
import {passBoolean} from "protractor/built/util";


@Injectable()
export class UserService implements CanActivate {
  userLoggedIn: boolean = false;
  loggedInUser: string;
  authUser: any;

  constructor(private router: Router) {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyBKb_D-ryf-iFoUyUjQDrz5hIcwzklLMg8",
      authDomain: "gigabytegames-bafe1.firebaseapp.com",
      databaseURL: "https://gigabytegames-bafe1.firebaseio.com",
      projectId: "gigabytegames-bafe1",
      storageBucket: "gigabytegames-bafe1.appspot.com",
      messagingSenderId: "433737791766"
    };
    firebase.initializeApp(config);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.verifyLogin(url);
  }


  verifyLogin(url: string) : boolean {
    if(this.userLoggedIn) {
      return true;
    }

    this.router.navigate(['/admin/login']);
    return false;
  }

  register(email: string, password: string) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(userRecord){

      })
      .catch(function (error) {
        console.log(error.message);
      });
  }

  verifyUser() {
    this.authUser = firebase.auth().currentUser;

    if(this.authUser) {
      console.log('Welcome' + this.authUser.email);
      this.loggedInUser = this.authUser.email;
      this.userLoggedIn = true;
      this.router.navigate(['/admin']);
    }
  }

  login(loginEmail: string, loginPassword: string, callback){
    firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword)
      .then(function(userRecord){
        console.log('Logged user: ' + userRecord.email);
        callback();
      })
      .catch(function(error) {
        console.log(error.message);
      });
  }

  logout() {
    this.userLoggedIn = false;
    firebase.auth().signOut().then(function () {
      console.log('Logged Out!')
    }, function (error) {
      console.log(error.message);
    });
  }
}
