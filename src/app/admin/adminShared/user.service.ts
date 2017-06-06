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


  public verifyLogin(url: string) : boolean {
    if(this.userLoggedIn) {
      return true;
    }

    this.router.navigate(['/admin/login']);
    return false;
  }

  public register(email: string, password: string) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(function (error) {
        alert('${error.message} Please Try Again!');
      });
  }

  public verifyUser() {
    this.authUser = firebase.auth().currentUser;

    if(this.authUser) {
      alert('Welcome ${this.authUser.email}');
      this.loggedInUser = this.authUser.email;
      this.userLoggedIn = true;
      this.router.navigate(['/admin']);
    }
  }

  public login(loginEmail: string, loginPassword: string) {
    firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword)
      .catch(function(error) {
        alert('${error.message} Unable to login. Try again!');
      });
  }

  public logout() {
    this.userLoggedIn = false;
    firebase.auth().signOut().then(function () {
      alert('Logged Out!')
    }, function (error) {
      alert('${error.message} Unable to logout. Try again!');
    });
  }
}
