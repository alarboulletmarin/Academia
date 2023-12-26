import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme: 'light-theme' | 'dark-theme' = 'light-theme';

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  switchTheme(theme: 'dark-theme' | 'light-theme'): void {
    if (this.currentTheme) {
      this.renderer.removeClass(document.body, this.currentTheme);
    }
    this.renderer.addClass(document.body, theme);
    this.currentTheme = theme;
  }

  public getCurrentTheme(): 'light-theme' | 'dark-theme' {
    return this.currentTheme;
  }

  public isDarkTheme() {
    return this.getCurrentTheme() === 'dark-theme';
  }
}
