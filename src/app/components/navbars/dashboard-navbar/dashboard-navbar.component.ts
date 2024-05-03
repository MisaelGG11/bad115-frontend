import { Component } from '@angular/core';
import { UserDropdownComponent } from '../../dropdowns/user-dropdown/user-dropdown.component';
import { NotificationDropdownComponent } from '../../dropdowns/notification-dropdown/notification-dropdown.component';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [UserDropdownComponent, NotificationDropdownComponent],
  templateUrl: './dashboard-navbar.component.html',
})
export class DashboardNavbarComponent {}
