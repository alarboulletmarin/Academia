import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  constructor(private translateService: TranslateService) {}

  /**
   * Sets the language to be used by the application and saves it in local storage.
   * @param language The language code to be used (e.g. 'en', 'fr', 'es')
   * @returns void
   */
  public useLanguage(language: string): void {
    this.translateService.use(language);
    localStorage.setItem('selectedLanguage', language);
  }

  /**
   * Returns the current language selected by the user, or 'fr' if no language is selected.
   * @returns {string} The current language selected by the user.
   */
  public getCurrentLanguage(): string {
    return localStorage.getItem('selectedLanguage') || 'fr';
  }
}
