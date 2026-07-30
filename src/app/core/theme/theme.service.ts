import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'math-city-theme';
  readonly isDark = signal(false);

  constructor() {
    this.setTheme(false);

    if (typeof document !== 'undefined') {
      document.documentElement.lang = 'en';
      document.documentElement.setAttribute('translate', 'no');
    }
  }

  setTheme(isDark: boolean): void {
    this.isDark.set(isDark);

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark);
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
    }
  }
}
