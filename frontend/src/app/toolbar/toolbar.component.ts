import { Component, OnInit } from '@angular/core';
import { SidenavService } from '../core/services/sidenav/sidenav.service';
import { AuthService } from '../core/services/auth/auth.service';
import { I18nService } from '../core/services/i18n/i18n.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  public isAuth: boolean = false;
  public savedLanguage: string | undefined;

  public languages: string[] = ['fr', 'en', 'de', 'es', 'it'];

  constructor(
    private sidenavService: SidenavService,
    private authService: AuthService,
    private i18nService: I18nService,
  ) {}

  ngOnInit(): void {
    this.savedLanguage = this.i18nService.getCurrentLanguage();
  }

  public useLanguage(language: string): void {
    this.i18nService.useLanguage(language);
  }

  public getCurrentLanguage(): string {
    return this.i18nService.getCurrentLanguage();
  }

  public toggleSidenav() {
    this.sidenavService.toggleSidenav();
  }

  public logout() {
    this.authService.logout();
  }

  public toggleTheme() {
    // TODO: Implement theme toggling
  }
}
