import {Component, OnInit} from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
import {AuthService} from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'assignment-app';
  showToolbarAndSidenav: boolean = true;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.autoLogin();

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.showToolbarAndSidenav = event.url !== '/login';
      }
    });
  }
}
