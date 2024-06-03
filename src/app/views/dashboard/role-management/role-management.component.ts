import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RolesListComponent } from './components/role-list/role-list.component';
import { CreateRoleComponent } from './components/create-role/create-role.component';
import { GlobalFunctionsService } from '../../../utils/services/global-functions.service';
import { PERMISSIONS } from '../../../utils/constants.utils';

@Component({
  selector: 'app-role-management-type',
  standalone: true,
  imports: [ButtonModule, RolesListComponent, CreateRoleComponent],
  templateUrl: './role-management.component.html',
  styles: [],
})
export class RoleManagementComponent {
  private global = inject(GlobalFunctionsService);
  showAddModal = signal(false);

  onClickCreate() {
    this.showAddModal.set(true);
  }

  canCreate() {
    return this.global.verifyPermission(PERMISSIONS.CREATE_ROLE);
  }
}
