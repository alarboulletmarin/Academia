import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { AuthService } from './core/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'assignment-app';
  showToolbarAndSidenav: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.translate.setDefaultLang('fr');
    this.translate.use('fr');
    this.authService.tokenCheck();
    this.authService.autoLogin();

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.showToolbarAndSidenav = event.url !== '/login';
      }
    });
  }
}
