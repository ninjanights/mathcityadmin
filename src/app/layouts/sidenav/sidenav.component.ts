import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavigationItem } from '../navigation/navigation';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent {

  @Input()
  items: NavigationItem[] = [];

}