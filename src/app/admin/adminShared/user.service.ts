import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import * as firebase from 'firebase';
import {User} from "./model/user";
import { LoggerService } from '../../shared/services/logger.service';


@Injectable()
export class UserService implements CanActivate {
  userLoggedIn: boolean = false;
  loggedInUser: User;

  constructor(private router: Router, private logger: LoggerService) {
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

  register(email: string, password: string, callback: any) {
    let self = this;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(userRecord) {
        self.logger.log.debug('Logged user: ' + userRecord.email);
        callback();
      })
      .catch(function (error) {
        self.logger.log.error(error.message, error);        
      });
  }

  verifyUser() {
    let self = this;
    let userFromDB = firebase.auth().currentUser;
    if(userFromDB) {
      this.loggedInUser = new User(userFromDB.email);
    }

    if(this.loggedInUser) {
      self.logger.log.debug('Welcome ' + this.loggedInUser.email);
      this.userLoggedIn = true;
      this.router.navigate(['/admin']);
    }
  }

  login(loginEmail: string, loginPassword: string, callback: any) {
    let self = this;
    firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword)
      .then((userRecord) => {
        self.logger.log.debug('Logged user: ' + userRecord.email);
        callback();
      })
      .catch((error) => {
        self.logger.log.error(error.message, error);
      });
  }

  logout(callback: any) {
    let self = this;
    this.userLoggedIn = false;
    firebase.auth().signOut().then(function () {
      self.logger.log.debug('Logged Out!')
      callback();
    }, function (error) {
      self.logger.log.debug(error.message, error);
    });
  }
}
