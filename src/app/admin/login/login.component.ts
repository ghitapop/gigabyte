import { Component, OnInit } from '@angular/core';
import { UserService } from '../adminShared/user.service';
import { Router } from '@angular/router';
import {User} from "../adminShared/model/user";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.user = new User('');
  }

  login() {
    this.userService.login(this.user.email, this.user.password, () => this.userService.verifyUser());
  }

  signUpFromLogin() {
    this.router.navigate(['/admin/signup']);
  }

  cancelFromLogin() {
    this.router.navigate(['']);
  }
}

