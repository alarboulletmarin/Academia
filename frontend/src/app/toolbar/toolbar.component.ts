import { Component, OnInit } from '@angular/core';
import { SidenavService } from '../core/services/sidenav/sidenav.service';
import { AuthService } from '../core/services/auth/auth.service';
import { I18nService } from '../core/services/i18n/i18n.service';
import { ThemeService } from '../core/services/theme/theme.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  public savedLanguage: string | undefined;
  public isDarkTheme: boolean = false;
  public languages: string[] = ['fr', 'en', 'de', 'es', 'it'];

  constructor(
    private sidenavService: SidenavService,
    private authService: AuthService,
    private i18nService: I18nService,
    private themeService: ThemeService,
  ) {}

  public ngOnInit() {
    this.savedLanguage = this.i18nService.getCurrentLanguage();
    this.isDarkTheme = this.themeService.isDarkTheme();
  }

  public useLanguage(language: string): void {
    this.i18nService.useLanguage(language);
  }

  public toggleSidenav() {
    this.sidenavService.toggleSidenav();
  }

  public logout() {
    this.authService.logout();
  }

  public toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.themeService.switchTheme(
      this.isDarkTheme ? 'dark-theme' : 'light-theme',
    );
  }
}
