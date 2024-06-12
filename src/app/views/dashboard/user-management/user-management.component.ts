import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { GlobalFunctionsService } from '../../../utils/services/global-functions.service';
import { PERMISSIONS } from '../../../utils/constants.utils';
import { UserListComponent } from './components/user-list/user-list.component';
import { CreateUserComponent } from './components/create-user/create-user.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ButtonModule, UserListComponent, CreateUserComponent],
  templateUrl: './user-management.component.html',
  styles: ``,
})
export class UserManagementComponent {
  private global = inject(GlobalFunctionsService);
  showAddModal = signal(false);

  onClickCreate() {
    this.showAddModal.set(true);
  }

  canCreate() {
    return this.global.verifyPermission(PERMISSIONS.CREATE_USER);
  }
}
