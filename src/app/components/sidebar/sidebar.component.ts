import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserDropdownComponent } from '../dropdowns/user-dropdown/user-dropdown.component';
import { NotificationDropdownComponent } from '../dropdowns/notification-dropdown/notification-dropdown.component';
import { CardMenu } from '../../interfaces/route.interface';
import { GlobalFunctionsService } from '../../utils/services/global-functions.service';

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
  @Input() visible = true;
  private global = inject(GlobalFunctionsService);
  router = inject(Router);
  roles = this.global.getRoles();
  routes = this.global.getMenu(true);

  collapseShow = 'hidden';

  toggleCollapseShow(classes: string) {
    this.collapseShow = classes;
  }
}
