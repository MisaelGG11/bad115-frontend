import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../../../services/user.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { DataTableComponent } from '../../../../../components/data-table/data-table.component';
import { PERMISSIONS } from '../../../../../utils/constants.utils';
import { TooltipModule } from 'primeng/tooltip';
import { NgClass } from '@angular/common';
import { Session, Role } from '../../../../../interfaces/user.interface';
import {
  PaginationTableInput,
  PaginationTableOutput,
} from '../../../../../interfaces/pagination.interface';
import { Store } from '@ngrx/store';
import { EditRoleComponent } from '../edit-role/edit-role.component';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [DataTableComponent, TooltipModule, NgClass, EditRoleComponent],
  templateUrl: './role-list.component.html',
  styles: [],
})
export class RolesListComponent implements OnInit {
  private userService = inject(UserService);
  private store = inject(Store);
  showAddModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  readonly = signal(false);
  selectedRole = signal<Role>({
    id: '',
    name: '',
    description: '',
    permissions: [],
  });
  sessionValue: Session | undefined;
  permissionUser: string[] = [];

  dataTable: Role[] = [];
  pagination: PaginationTableInput = {
    total: 0,
    perPage: signal(10),
    page: signal(1),
  };

  columns = [
    { field: 'id', header: 'ID', column_align: 'left', row_align: 'center' },
    { field: 'name', header: 'Nombre', column_align: 'left', row_align: 'center' },
  ];

  actionsList: any[] = [];

  rolesRequest = injectQuery(() => ({
    queryKey: ['roles', { page: this.pagination.page(), perPage: this.pagination.perPage() }],
    queryFn: async () => {
      const response = await this.userService.findRoles({
        page: this.pagination.page(),
        perPage: this.pagination.perPage(),
      });
      const { data, pagination } = response;
      this.pagination.total = pagination.totalItems ?? 0;
      this.dataTable = data ?? [];

      return response;
    },
  }));

  async ngOnInit() {
    await this.rolesRequest.refetch();
    this.store.select('session').subscribe((session) => {
      this.sessionValue = session;
      this.permissionUser = this.sessionValue?.user?.permissions ?? [];
      this.actionsList = [
        {
          label: 'Visualizar',
          icon: 'visibility',
          iconColor: 'text-blue-500',
          permission: this.permissionUser.includes(PERMISSIONS.READ_ROLE),
          onClick: (value: Role) => {
            this.onClickVisualize(value);
          },
        },
        {
          label: 'Editar',
          icon: 'edit',
          iconColor: 'text-orange',
          permission: this.permissionUser.includes(PERMISSIONS.UPDATE_ROLE),
          onClick: (value: Role) => {
            this.onClickEdit(value);
          },
        },
        {
          label: 'Eliminar',
          icon: 'delete',
          iconColor: 'text-red-600',
          permission: this.permissionUser.includes(PERMISSIONS.DELETE_ROLE),
          onClick: (value: Role) => {
            this.onClickDelete(value);
          },
        },
      ];
    });
  }

  async paginatePage(pag: PaginationTableOutput) {
    this.pagination.page.set(pag.page);
    this.pagination.perPage.set(pag.perPage);

    await this.rolesRequest.refetch();
  }

  onClickVisualize(value: Role) {
    this.selectedRole.set(value);
    this.readonly.set(true);
    this.showEditModal.set(true);
  }

  onClickEdit(value: Role) {
    this.selectedRole.set(value);
    this.readonly.set(false);
    this.showEditModal.set(true);
  }

  onClickDelete(value: Role) {
    this.selectedRole.set(value);
    this.showDeleteModal.set(true);
  }

  constructor() {}
}
