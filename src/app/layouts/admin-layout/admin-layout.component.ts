import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

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

  navigation = NAVIGATION;

  // Default selected menu
  selectedMenu: NavigationItem = NAVIGATION[1]; // Content

  onMenuSelected(menu: NavigationItem): void {
    this.selectedMenu = menu;
  }

}