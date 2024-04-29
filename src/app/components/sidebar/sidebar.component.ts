import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserDropdownComponent } from '../dropdowns/user-dropdown/user-dropdown.component';
import { NotificationDropdownComponent } from '../dropdowns/notification-dropdown/notification-dropdown.component';
import { Route } from '../../interfaces/route';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    UserDropdownComponent,
    NotificationDropdownComponent,
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  collapseShow = 'hidden';

  toggleCollapseShow(classes: string) {
    this.collapseShow = classes;
  }

  routes: Route[] = [
    { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tv' },
    { name: 'Settings', path: '/dashboard/settings', icon: 'fa fa-tools' },
  ];
}
