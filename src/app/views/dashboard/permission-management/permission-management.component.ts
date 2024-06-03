import { Component, signal, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { GlobalFunctionsService } from '../../../utils/services/global-functions.service';
import { PERMISSIONS } from '../../../utils/constants.utils';
import { PermissionListComponent } from './components/permission-list/permission-list.component';
import { CreatePermissionComponent } from './components/create-permission/create-permission.component';

@Component({
  selector: 'app-permission-management-type',
  standalone: true,
  imports: [ButtonModule, PermissionListComponent, CreatePermissionComponent],
  templateUrl: './permission-management.component.html',
  styles: [],
})
export class PermissionManagementComponent {
  private global = inject(GlobalFunctionsService);
  showAddModal = signal(false);

  onClickCreate() {
    this.showAddModal.set(true);
  }

  canCreate() {
    return this.global.verifyPermission(PERMISSIONS.CREATE_USER);
  }
}
