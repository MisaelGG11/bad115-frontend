import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PermissionListComponent } from './permission-list/permission-list.component';
import { CreatePermissionComponent } from './create-permission/create-permission.component';

@Component({
  selector: 'app-permission-management-type',
  standalone: true,
  imports: [ButtonModule, PermissionListComponent, CreatePermissionComponent],
  templateUrl: './permission-management.component.html',
  styles: [],
})
export class PermissionManagementComponent {
  showAddModal = signal(false);

  onClickCreate() {
    this.showAddModal.set(true);
  }
}
