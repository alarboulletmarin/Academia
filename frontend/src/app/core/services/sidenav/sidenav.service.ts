import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {UserService} from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class SidenavService implements OnInit {
  public user = new BehaviorSubject<any>(null);
  private sidenavOpen = new BehaviorSubject<boolean>(false);
  public sidenavOpen$ = this.sidenavOpen.asObservable();

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
  }

  toggleSidenav() {
    this.sidenavOpen.next(!this.sidenavOpen.value);
  }

  public getUser() {
    const token = this.authService.getToken();
    if (token) {
      this.userService.getUser(token.id).subscribe((user) => {
        if (user) {
          this.user.next(user);
        }
      });
    }
  }
}
