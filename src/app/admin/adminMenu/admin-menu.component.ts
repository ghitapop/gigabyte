import { Component, OnInit } from '@angular/core';
import { UserService } from '../adminShared/user.service';
import { Router } from '@angular/router';
import {User} from "../adminShared/model/user.model";


@Component({
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {
  theUser: User;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.theUser = this.userService.loggedInUser;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['']);
  }

}
