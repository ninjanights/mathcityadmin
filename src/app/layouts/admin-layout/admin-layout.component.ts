import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

import { NavbarComponent } from '../navbar/navbar.component';
import { SidenavComponent } from '../sidenav/sidenav.component';

import { NAVIGATION, NavigationItem } from '../navigation/navigation';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidenavComponent
  ],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {

  private readonly router = inject(Router);
  navigation = NAVIGATION;

  // Resolve initial menu from current URL, fallback to Content
  selectedMenu: NavigationItem = this.resolveMenuFromUrl(this.router.url) ?? NAVIGATION[1];

  onMenuSelected(menu: NavigationItem): void {
    this.selectedMenu = menu;
  }

  private resolveMenuFromUrl(url: string): NavigationItem | undefined {
    return this.navigation.find((item) => {
      if (item.route && url.startsWith(item.route)) return true;
      if (item.children) {
        return item.children.some((child) => child.route && url.startsWith(child.route));
      }
      return false;
    });
  }

}