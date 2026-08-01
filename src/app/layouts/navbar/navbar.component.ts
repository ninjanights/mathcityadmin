import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

import { NAVIGATION, NavigationItem } from '../navigation/navigation';
import { TokenService } from '../../core/auth/token.service';
import { ThemeService } from '../../core/theme/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  navigation = NAVIGATION;
  selectedMenu: NavigationItem = this.navigation[0];
  readonly theme = inject(ThemeService);
  isDark = this.theme.isDark;
  private readonly router = inject(Router);

  @Output()
  menuSelected = new EventEmitter<NavigationItem>();

  constructor(public tokenService: TokenService) {}

  ngOnInit(): void {
    // Sync sidenav on every navigation
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.syncMenuFromUrl(e.urlAfterRedirects);
      });

    // Sync on initial load
    this.syncMenuFromUrl(this.router.url);
  }

  private syncMenuFromUrl(url: string): void {
    const matched = this.navigation.find((item) => {
      if (item.route && url.startsWith(item.route)) return true;
      if (item.children) {
        return item.children.some((child) => child.route && url.startsWith(child.route));
      }
      return false;
    });

    if (matched && matched.id !== this.selectedMenu.id) {
      this.selectedMenu = matched;
      this.menuSelected.emit(matched);
    }
  }

  selectMenu(item: NavigationItem) {
    this.selectedMenu = item;
    this.menuSelected.emit(item);
  }

  logout() {
    this.tokenService.clear();
    location.href = '/auth/login';
  }
}
