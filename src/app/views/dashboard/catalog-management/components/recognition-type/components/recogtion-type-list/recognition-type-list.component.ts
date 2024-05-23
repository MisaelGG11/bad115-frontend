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

@Component({
  selector: 'app-recognition-type-list',
  standalone: true,
  imports: [DataTableComponent, TooltipModule, NgClass],
  templateUrl: './recognition-type-list.component.html',
  styles: [],
})
export class RecognitionTypeListComponent implements OnInit {
  private recognitionTypeService = inject(RecognitionTypeService);
  private authService = inject(AuthService);
  showAddModal = signal(false);
  showDeleteModal = signal(false);
  showEditModal = signal(false);
  selectedRecognitionType = signal<RecognitionType | null>(null);

  permissionUser = this.authService.getPermissions();
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

  actionsList = [
    {
      label: 'Editar',
      icon: 'edit',
      iconColor: 'text-orange',
      permission: this.permissionUser.includes(PERMISSIONS.UPDATE_CATALOG),
      onClick: (value: RecognitionType) => {
        this.selectedRecognitionType.set(value);
        this.showEditModal.set(true);
      },
    },
    {
      label: 'Eliminar',
      icon: 'delete',
      iconColor: 'text-red-600',
      permission: this.permissionUser.includes(PERMISSIONS.DELETE_CATALOG),
      onClick: (value: RecognitionType) => {
        this.selectedRecognitionType.set(value);
        this.showDeleteModal.set(true);
      },
    },
  ];

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
  }

  async paginatePage(pag: PaginationTableOutput) {
    this.pagination.page.set(pag.page);
    this.pagination.perPage.set(pag.perPage);

    await this.recognitionTypesRequest.refetch();
  }

  constructor() {}
}
