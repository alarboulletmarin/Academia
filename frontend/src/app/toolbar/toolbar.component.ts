import {Component, OnInit} from "@angular/core";
import {SidenavService} from "../core/services/sidenav/sidenav.service";
import {AuthService} from "../core/services/auth/auth.service";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.css"],
})
export class ToolbarComponent implements OnInit {
  public isAuth: boolean = false;

  constructor(
    private sidenavService: SidenavService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
  }

  public toggleSidenav() {
    this.sidenavService.toggleSidenav();
  }

  public logout() {
    this.authService.logout();
  }

  public toggleTheme() {
    // this.authService.toggleTheme();
  }
}
