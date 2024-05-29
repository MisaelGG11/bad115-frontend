import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RolesListComponent } from './role-list/role-list.component';
import { CreateRoleComponent } from './create-role/create-role.component';

@Component({
  selector: 'app-role-management-type',
  standalone: true,
  imports: [ButtonModule, RolesListComponent, CreateRoleComponent],
  templateUrl: './role-management.component.html',
  styles: [],
})
export class RoleManagementComponent {
  showAddModal = signal(false);

  onClickCreate() {
    this.showAddModal.set(true);
  }
}
