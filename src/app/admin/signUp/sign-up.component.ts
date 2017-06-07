import {Component, OnInit} from '@angular/core';
import { UserService } from '../adminShared/user.service';
import { Router } from '@angular/router';
import {User} from "../adminShared/model/user.model";

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  user: User;
  passwordFail: boolean = false;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.user = new User('', '', '');
  }

  signUp() {
    if(this.user.password !== this.user.password1) {
      this.passwordFail = true;
    } else {
      this.passwordFail = false;
      this.userService.register(this.user.email, this.user.password, () => this.userService.verifyUser());
    }
  }

  cancel() {
    this.router.navigate(['/admin/login']);
  }

}
