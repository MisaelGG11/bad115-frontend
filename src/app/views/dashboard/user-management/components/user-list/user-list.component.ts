import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../../../services/user.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { DataTableComponent } from '../../../../../components/data-table/data-table.component';
import { PERMISSIONS } from '../../../../../utils/constants.utils';
import { TooltipModule } from 'primeng/tooltip';
import { NgClass } from '@angular/common';
import { Session, User } from '../../../../../interfaces/user.interface';
import {
  PaginationTableInput,
  PaginationTableOutput,
} from '../../../../../interfaces/pagination.interface';
import { Store } from '@ngrx/store';
import { EditUserComponent } from '../edit-user/edit-user.component';

export interface DataTableUser {
  id: string;
  email: string;
  name: string;
  roles: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [DataTableComponent, TooltipModule, NgClass, EditUserComponent],
  templateUrl: './user-list.component.html',
  styles: [],
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private store = inject(Store);
  showEditModal = signal(false);
  showBlockModal = signal(false);
  readonly = signal(false);
  selectedUser = signal<User | null>(null);
  sessionValue: Session | undefined;
  permissionUser: string[] = [];

  dataTable: DataTableUser[] = [];
  pagination: PaginationTableInput = {
    total: 0,
    perPage: signal(10),
    page: signal(1),
  };
  search = signal('');
  sortBy = signal('createdAt-desc');
  sortUsersOptions = [
    { label: 'Más recientes', value: 'createdAt-desc' },
    { label: 'Mas antiguos', value: 'createdAt-asc' },
    { label: 'Alfabetico ascendente', value: 'person.firstName-asc' },
    { label: 'Alfabetico descendente', value: 'person.firstName-desc' },
  ];

  columns = [
    { field: 'id', header: 'ID', column_align: 'left', row_align: 'center' },
    { field: 'name', header: 'Nombre de usuario', column_align: 'left', row_align: 'center' },
    { field: 'email', header: 'Correo', column_align: 'left', row_align: 'center' },
    { field: 'roles', header: 'Roles', column_align: 'left', row_align: 'center' },
  ];

  actionsList: any[] = [];

  usersRequest = injectQuery(() => ({
    queryKey: [
      'users',
      { page: this.pagination.page(), perPage: this.pagination.perPage(), search: this.search() },
    ],
    queryFn: async () => {
      const response = await this.userService.findUsers(
        {
          page: this.pagination.page(),
          perPage: this.pagination.perPage(),
        },
        this.search(),
        this.sortBy(),
      );
      const { data, pagination } = response;
      this.pagination.total = pagination.totalItems ?? 0;
      this.pagination.total = pagination.totalItems ?? 0;
      this.dataTable = [];
      data?.forEach((user) => {
        this.dataTable.push({
          id: user.id,
          email: user.email,
          name: user.company
            ? user.company.name
            : [
                user.person.firstName,
                user.person.middleName,
                user.person.lastName,
                user.person.secondLastName,
              ]
                .filter(Boolean)
                .join(' '),
          roles: user.roles.map((role) => role.name).join(', '),
        });
      });
      console.log('data', this.dataTable);
      return response;
    },
  }));
  User: any;

  async ngOnInit() {
    await this.usersRequest.refetch();
    this.store.select('session').subscribe((session) => {
      this.sessionValue = session;
    });
    this.permissionUser = this.sessionValue?.user?.permissions ?? [];
    this.actionsList = [
      {
        label: 'Visualizar',
        icon: 'visibility',
        iconColor: 'text-blue-500',
        permission: this.permissionUser.includes(PERMISSIONS.READ_USER),
        onClick: (value: User) => {
          console.log(value);
          this.onClickVisualize(value);
        },
      },
      {
        label: 'Editar',
        icon: 'edit',
        iconColor: 'text-orange',
        permission: this.permissionUser.includes(PERMISSIONS.UPDATE_USER),
        onClick: (value: User) => {
          this.onClickEdit(value);
        },
      },
      {
        label: 'Bloquear',
        icon: 'block',
        iconColor: 'text-red-600',
        permission: this.permissionUser.includes(PERMISSIONS.DELETE_USER),
        onClick: (value: User) => {
          this.onClickBlock(value);
        },
      },
    ];
  }

  async paginatePage(pag: PaginationTableOutput) {
    this.pagination.page.set(pag.page);
    this.pagination.perPage.set(pag.perPage);

    await this.usersRequest.refetch();
  }

  async filterData(search: string) {
    this.search.set(search);
    await this.usersRequest.refetch();
  }

  async sortData(sortBy: string) {
    this.sortBy.set(sortBy);
    await this.usersRequest.refetch();
  }

  onClickVisualize(value: User) {
    this.selectedUser.set(value);
    this.readonly.set(true);
    this.showEditModal.set(true);
  }

  onClickEdit(value: User) {
    this.selectedUser.set(value);
    this.readonly.set(false);
    this.showEditModal.set(true);
  }

  onClickBlock(value: User) {
    this.selectedUser.set(value);
    this.showBlockModal.set(true);
  }

  constructor() {}
}
