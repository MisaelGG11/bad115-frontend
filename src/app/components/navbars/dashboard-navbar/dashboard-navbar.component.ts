import { Component, EventEmitter, Output } from '@angular/core';
import { UserDropdownComponent } from '../../dropdowns/user-dropdown/user-dropdown.component';
import { NotificationDropdownComponent } from '../../dropdowns/notification-dropdown/notification-dropdown.component';
import { CandidateSearcherComponent } from '../../dropdowns/candidate-searcher/candidate-searcher.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [
    UserDropdownComponent,
    NotificationDropdownComponent,
    CommonModule,
    CandidateSearcherComponent,
  ],
  templateUrl: './dashboard-navbar.component.html',
  styles: ``,
})
export class DashboardNavbarComponent {
  visible = true;
  @Output() showSidebar = new EventEmitter<boolean>();

  toggleSidebar() {
    this.visible = !this.visible;
    this.showSidebar.emit(this.visible);
  }
}
