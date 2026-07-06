import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'math-city-theme';
  readonly isDark = signal(true);

  constructor() {
    const savedTheme = typeof localStorage === 'undefined' ? null : localStorage.getItem(this.storageKey);
    this.setTheme(savedTheme ? savedTheme === 'dark' : true);
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
