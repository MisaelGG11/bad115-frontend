import { Component, inject, OnInit, signal } from '@angular/core';
import { RecognitionTypeService } from '../../../../../../../services/recognition-type.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { DataTableComponent } from '../../../../../../../components/data-table/data-table.component';
import { getPersonLocalStorage } from '../../../../../../../utils/person-local-storage.utils';
import { AuthService } from '../../../../../../../services/auth.service';
import { PERMISSIONS } from '../../../../../../../utils/constants.utils';
import { TooltipModule } from 'primeng/tooltip';
import { NgClass } from '@angular/common';
import { RecognitionType } from '../../../../../../../interfaces/recognition-type.interface';
import {
  PaginationTableInput,
  PaginationTableOutput,
} from '../../../../../../../interfaces/pagination.interface';
import { Store } from '@ngrx/store';
import { Session } from '../../../../../../../interfaces/user.interface';
import { DeleteRecognitionTypeComponent } from '../delete-recognition-type/delete-recognition-type.component';
import { EditRecognitionTypeComponent } from '../edit-recognition-type/edit-recognition-type.component';

@Component({
  selector: 'app-recognition-type-list',
  standalone: true,
  imports: [
    DataTableComponent,
    TooltipModule,
    NgClass,
    DeleteRecognitionTypeComponent,
    EditRecognitionTypeComponent,
  ],
  templateUrl: './recognition-type-list.component.html',
  styles: [],
})
export class RecognitionTypeListComponent implements OnInit {
  private recognitionTypeService = inject(RecognitionTypeService);
  private store = inject(Store);
  showAddModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  selectedRecognitionType = signal<RecognitionType>({
    id: '',
    name: '',
  });
  sessionValue: Session | undefined;
  permissionUser: string[] = [];

  person = getPersonLocalStorage();
  dataTable: RecognitionType[] = [];
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

  recognitionTypesRequest = injectQuery(() => ({
    queryKey: [
      'recognitionTypes',
      { page: this.pagination.page(), perPage: this.pagination.perPage() },
    ],
    queryFn: async () => {
      const response = await this.recognitionTypeService.find({
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
    await this.recognitionTypesRequest.refetch();
    this.store.select('session').subscribe((session) => {
      this.sessionValue = session;
    });
    this.permissionUser = this.sessionValue?.user?.permissions ?? [];
    this.actionsList = [
      {
        label: 'Editar',
        icon: 'edit',
        iconColor: 'text-orange',
        permission: this.permissionUser.includes(PERMISSIONS.UPDATE_CATALOG),
        onClick: (value: RecognitionType) => {
          this.onClickEdit(value);
        },
      },
      {
        label: 'Eliminar',
        icon: 'delete',
        iconColor: 'text-red-600',
        permission: this.permissionUser.includes(PERMISSIONS.DELETE_CATALOG),
        onClick: (value: RecognitionType) => {
          this.onClickDelete(value);
        },
      },
    ];
  }

  async paginatePage(pag: PaginationTableOutput) {
    this.pagination.page.set(pag.page);
    this.pagination.perPage.set(pag.perPage);

    await this.recognitionTypesRequest.refetch();
  }

  onClickEdit(value: RecognitionType) {
    this.selectedRecognitionType.set(value);
    this.showEditModal.set(true);
  }

  onClickDelete(value: RecognitionType) {
    this.selectedRecognitionType.set(value);
    this.showDeleteModal.set(true);
  }

  constructor() {}
}
