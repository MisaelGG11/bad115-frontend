import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../../../services/auth.service';
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
import { UnlockRequestResolutionComponent } from '../unlock-request-resolution/unlock-request-resolution.component';
import { VisualizeUnlockRequestComponent } from '../visualize-unlock-request/visualize-unlock-request.component';

export interface DataTableUnlockRequest {
  id: string;
  email: string;
  name: string;
  lastName: string;
  status: string;
  reason: string | null;
}

@Component({
  selector: 'app-unlock-request-list',
  standalone: true,
  imports: [
    DataTableComponent,
    UnlockRequestResolutionComponent,
    VisualizeUnlockRequestComponent,
    TooltipModule,
    NgClass,
  ],
  templateUrl: './unlock-request-list.component.html',
  styles: [],
})
export class UnlockRequestListComponent implements OnInit {
  private authService = inject(AuthService);
  private store = inject(Store);
  showAddModal = signal(false);
  showResolutionModal = signal(false);
  showVisualizeModal = signal(false);
  selectedUnlockRequest = signal<DataTableUnlockRequest>({
    id: '',
    email: '',
    name: '',
    lastName: '',
    status: '',
    reason: '',
  });
  selectedStatus = signal('');
  sessionValue: Session | undefined;
  permissionUser: string[] = [];

  dataTable: DataTableUnlockRequest[] = [];
  pagination: PaginationTableInput = {
    total: 0,
    perPage: signal(10),
    page: signal(1),
  };

  columns = [
    { field: 'id', header: 'ID', column_align: 'left', row_align: 'center' },
    { field: 'name', header: 'Nombres', column_align: 'left', row_align: 'center' },
    { field: 'lastName', header: 'Apellidos', column_align: 'left', row_align: 'center' },
    { field: 'email', header: 'Correo', column_align: 'left', row_align: 'center' },
    { field: 'status', header: 'Estado', column_align: 'left', row_align: 'center' },
  ];

  actionsList: any[] = [];

  unlockUsersRequest = injectQuery(() => ({
    queryKey: [
      'unlock-requests',
      { page: this.pagination.page(), perPage: this.pagination.perPage() },
    ],
    queryFn: async () => {
      const response = await this.authService.unlockRequests({
        page: this.pagination.page(),
        perPage: this.pagination.perPage(),
      });
      const { data, pagination } = response;
      this.pagination.total = pagination.totalItems ?? 0;
      this.dataTable = [];
      data?.forEach((unlockRequest) => {
        switch (unlockRequest.status) {
          case 'PENDING':
            unlockRequest.status = 'Pendiente';
            break;
          case 'APPROVED':
            unlockRequest.status = 'Aprobada';
            break;
          case 'REJECTED':
            unlockRequest.status = 'Rechazada';
            break;
          default:
            unlockRequest.status = 'No definido';
            break;
        }
        this.dataTable.push({
          id: unlockRequest.id,
          email: unlockRequest.user.email,
          name: [unlockRequest.user.person.firstName, unlockRequest.user.person.middleName].join(
            ' ',
          ),
          lastName: [
            unlockRequest.user.person.lastName,
            unlockRequest.user.person.secondLastName,
          ].join(' '),
          status: unlockRequest.status,
          reason: unlockRequest.reason,
        });
      });

      return response;
    },
  }));

  async ngOnInit() {
    await this.unlockUsersRequest.refetch();
    this.store.select('session').subscribe((session) => {
      this.sessionValue = session;
    });
    this.permissionUser = this.sessionValue?.user?.permissions ?? [];
    this.actionsList = [
      {
        label: 'Visualizar',
        icon: 'visibility',
        iconColor: 'text-blue-500',
        permission: this.permissionUser.includes(PERMISSIONS.READ_UNLOCK_REQUEST),
        onClick: (value: DataTableUnlockRequest) => {
          this.onClickVisualize(value);
        },
      },
      {
        label: 'Aceptar solicitud',
        icon: 'check_circle',
        iconColor: 'text-green-500',
        permission: this.permissionUser.includes(PERMISSIONS.UNLOCK_USER),
        onClick: (value: DataTableUnlockRequest) => {
          this.onClickApprove(value);
        },
      },
      {
        label: 'Rechazar solicitud',
        icon: 'cancel',
        iconColor: 'text-red-500',
        permission: this.permissionUser.includes(PERMISSIONS.UNLOCK_USER),
        onClick: (value: DataTableUnlockRequest) => {
          this.onClickReject(value);
        },
      },
    ];
  }

  async paginatePage(pag: PaginationTableOutput) {
    this.pagination.page.set(pag.page);
    this.pagination.perPage.set(pag.perPage);

    await this.unlockUsersRequest.refetch();
  }

  onClickVisualize(value: DataTableUnlockRequest) {
    this.selectedUnlockRequest.set(value);
    this.selectedStatus.set(value.status);
    this.showVisualizeModal.set(true);
  }

  onClickReject(value: DataTableUnlockRequest) {
    this.selectedUnlockRequest.set(value);
    this.selectedStatus.set('REJECTED');
    this.showResolutionModal.set(true);
  }

  onClickApprove(value: DataTableUnlockRequest) {
    this.selectedUnlockRequest.set(value);
    this.selectedStatus.set('APPROVED');
    this.showResolutionModal.set(true);
  }

  constructor() {}
}
