import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserProfile, UserData } from '../models/user-profile';

@Component({
  selector: 'app-page-admin-users',
  templateUrl: './page-admin-users.component.html',
  styleUrls: ['./page-admin-users.component.css']
})
export class PageAdminUsersComponent implements OnInit {

  users: UserData[];
  selectedUser: UserData;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      console.log('Users returned: ', this.users);
    });
  }

  adminChange(rowData) {
    console.log(`adminChanged..`, rowData);
    // this.selectedUser.isAdmin = event.checked;
    this.userService.saveUser(rowData);
  }

  onEditComplete(event) {
    console.log('Table Edited', event);
    if (this.selectedUser) {
      this.userService.saveUser(this.selectedUser);
    }
  }

  onRowSelected(event) {
  //  console.log('Table row selected:', event);
  }

}
