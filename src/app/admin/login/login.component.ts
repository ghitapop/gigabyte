import { Component, OnInit } from '@angular/core';
import { UserService } from '../adminShared/user.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password1: string;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.email = '';
    this.password1 = '';
  }

  login() {
    this.userService.login(this.email, this.password1, () => this.userService.verifyUser());
  }

  signUpFromLogin() {
    this.router.navigate(['/admin/signup']);
  }

  cancelFromLogin() {
    this.router.navigate(['']);
  }
}
