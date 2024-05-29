import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { DataTableComponent } from '../../../../components/data-table/data-table.component';
import { PERMISSIONS } from '../../../../utils/constants.utils';
import { TooltipModule } from 'primeng/tooltip';
import { NgClass } from '@angular/common';
import { Session, Permission } from '../../../../interfaces/user.interface';
import {
  PaginationTableInput,
  PaginationTableOutput,
} from '../../../../interfaces/pagination.interface';
import { Store } from '@ngrx/store';
import { DeletePermissionComponent } from '../delete-permission/delete-permission.component';
import { EditPermissionComponent } from '../edit-permission/edit-permission.component';

@Component({
  selector: 'app-permission-list',
  standalone: true,
  imports: [
    DataTableComponent,
    TooltipModule,
    NgClass,
    EditPermissionComponent,
    DeletePermissionComponent,
  ],
  templateUrl: './permission-list.component.html',
  styles: [],
})
export class PermissionListComponent implements OnInit {
  private userService = inject(UserService);
  private store = inject(Store);
  showAddModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  readonly = signal(false);
  selectedPermission = signal<Permission>({
    id: '',
    name: '',
    description: '',
    codename: '',
  });
  sessionValue: Session | undefined;
  permissionUser: string[] = [];

  dataTable: Permission[] = [];
  pagination: PaginationTableInput = {
    total: 0,
    perPage: signal(10),
    page: signal(1),
  };

  columns = [
    { field: 'id', header: 'ID', column_align: 'left', row_align: 'center' },
    { field: 'name', header: 'Nombre', column_align: 'left', row_align: 'center' },
    { field: 'codename', header: 'Código de permiso', column_align: 'left', row_align: 'center' },
  ];

  actionsList: any[] = [];

  permissionsRequest = injectQuery(() => ({
    queryKey: ['permissions', { page: this.pagination.page(), perPage: this.pagination.perPage() }],
    queryFn: async () => {
      const response = await this.userService.findPermissions({
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
    await this.permissionsRequest.refetch();
    this.store.select('session').subscribe((session) => {
      this.sessionValue = session;
    });
    this.permissionUser = this.sessionValue?.user?.permissions ?? [];
    this.actionsList = [
      {
        label: 'Visualizar',
        icon: 'visibility',
        iconColor: 'text-blue-500',
        permission: this.permissionUser.includes(PERMISSIONS.READ_CATALOG),
        onClick: (value: Permission) => {
          this.onClickVisualize(value);
        },
      },
      {
        label: 'Editar',
        icon: 'edit',
        iconColor: 'text-orange',
        permission: this.permissionUser.includes(PERMISSIONS.UPDATE_CATALOG),
        onClick: (value: Permission) => {
          this.onClickEdit(value);
        },
      },
      {
        label: 'Eliminar',
        icon: 'delete',
        iconColor: 'text-red-600',
        permission: this.permissionUser.includes(PERMISSIONS.DELETE_CATALOG),
        onClick: (value: Permission) => {
          this.onClickDelete(value);
        },
      },
    ];
  }

  async paginatePage(pag: PaginationTableOutput) {
    this.pagination.page.set(pag.page);
    this.pagination.perPage.set(pag.perPage);

    await this.permissionsRequest.refetch();
  }

  onClickVisualize(value: Permission) {
    this.selectedPermission.set(value);
    this.readonly.set(true);
    this.showEditModal.set(true);
  }

  onClickEdit(value: Permission) {
    this.selectedPermission.set(value);
    this.readonly.set(false);
    this.showEditModal.set(true);
  }

  onClickDelete(value: Permission) {
    this.selectedPermission.set(value);
    this.showDeleteModal.set(true);
  }

  constructor() {}
}
