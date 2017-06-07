import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import * as firebase from 'firebase';
import {User} from "./model/user";



@Injectable()
export class UserService implements CanActivate {
  userLoggedIn: boolean = false;
  loggedInUser: User;

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

  register(email: string, password: string, callback) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(userRecord){
        console.log('Logged user: ' + userRecord.email);
        callback();
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }

  verifyUser() {
    let userFromDB = firebase.auth().currentUser;
    if(userFromDB) {
      this.loggedInUser = new User(userFromDB.email);
    }

    if(this.loggedInUser) {
      console.log('Welcome' + this.loggedInUser.email);
      this.userLoggedIn = true;
      this.router.navigate(['/admin']);
    }
  }

  login(loginEmail: string, loginPassword: string, callback){
    firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword)
      .then((userRecord) => {
        console.log('Logged user: ' + userRecord.email);
        callback();
      })
      .catch((error) => {
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
