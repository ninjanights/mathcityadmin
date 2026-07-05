import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NAVIGATION, NavigationItem } from '../navigation/navigation';
import { TokenService } from '../../core/auth/token.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  navigation = NAVIGATION;
  selectedMenu: NavigationItem = this.navigation[0];

  @Output()
  menuSelected = new EventEmitter<NavigationItem>();

  constructor(public tokenService: TokenService) {}

  selectMenu(item: NavigationItem) {
    this.selectedMenu = item;
    this.menuSelected.emit(item);
  }

  logout() {
    this.tokenService.clear();
    location.href = '/auth/login';
  }
}
