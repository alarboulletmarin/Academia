import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-list-users-page',
  templateUrl: './list-users-page.component.html',
  styleUrls: ['./list-users-page.component.scss'],
})
export class ListUsersPageComponent implements OnInit {
  public users: User[] = [];

  displayedColumns: string[] = ['email', 'password', 'role'];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users.map((user: { password: string }) => ({
        ...user,
        password: this.maskPassword(user.password),
      }));
    });
  }

  private maskPassword(password: string): string {
    return '*'.repeat(password.length);
  }
}
