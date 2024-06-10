import { Component, EventEmitter, inject, Output } from '@angular/core';
import { UserDropdownComponent } from '../../dropdowns/user-dropdown/user-dropdown.component';
import { NotificationDropdownComponent } from '../../dropdowns/notification-dropdown/notification-dropdown.component';
import { CandidateSearcherComponent } from '../../dropdowns/candidate-searcher/candidate-searcher.component';
import { CommonModule } from '@angular/common';
import { GlobalFunctionsService } from '../../../utils/services/global-functions.service';

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
  private global = inject(GlobalFunctionsService);
  visible = true;
  @Output() showSidebar = new EventEmitter<boolean>();
  roles = this.global.getRoles();
  canSearch = this.roles.includes('user') || this.roles.includes('recruiter');

  toggleSidebar() {
    this.visible = !this.visible;
    this.showSidebar.emit(this.visible);
  }
}
