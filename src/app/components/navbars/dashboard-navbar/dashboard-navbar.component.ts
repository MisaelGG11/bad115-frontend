import { Component, computed, EventEmitter, Output, signal, SimpleChanges } from '@angular/core';
import { UserDropdownComponent } from '../../dropdowns/user-dropdown/user-dropdown.component';
import { NotificationDropdownComponent } from '../../dropdowns/notification-dropdown/notification-dropdown.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [UserDropdownComponent, NotificationDropdownComponent, CommonModule],
  templateUrl: './dashboard-navbar.component.html',
})
export class DashboardNavbarComponent {
  visible = true;
  @Output() showSidebar = new EventEmitter<boolean>();

  toggleSidebar() {
    this.visible = !this.visible;
    console.log(this.visible);
    this.showSidebar.emit(this.visible);
  }
}
