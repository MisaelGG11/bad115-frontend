import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryTecnicalHabilitieService } from '../../../../../../../services/category-tecnical-habilitie.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { DataTableComponent } from '../../../../../../../components/data-table/data-table.component';
import { getPersonLocalStorage } from '../../../../../../../utils/person-local-storage.utils';
import { AuthService } from '../../../../../../../services/auth.service';
import { PERMISSIONS } from '../../../../../../../utils/constants.utils';
import { TooltipModule } from 'primeng/tooltip';
import { NgClass } from '@angular/common';
import { CategoryTecnicalHabilitie } from '../../../../../../../interfaces/category-tecnical-habilitie.interface';
import {
  PaginationTableInput,
  PaginationTableOutput,
} from '../../../../../../../interfaces/pagination.interface';

@Component({
  selector: 'app-category-tecnical-habilitie-list',
  standalone: true,
  imports: [DataTableComponent, TooltipModule, NgClass],
  templateUrl: './category-tecnical-habilitie-list.component.html',
  styles: [],
})
export class CategoryTecnicalHabilitieListComponent implements OnInit {
  private categoryTecnicalHabilitieService = inject(CategoryTecnicalHabilitieService); 
  private authService = inject(AuthService);
  permissionUser = this.authService.getPermissions();
  person = getPersonLocalStorage();
  dataTable: CategoryTecnicalHabilitie[] = [];
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
      onClick: (value: any) => {
        console.log('Editar:', value);
      },
    },
    {
      label: 'Eliminar',
      icon: 'delete',
      iconColor: 'text-red-600',
      permission: this.permissionUser.includes(PERMISSIONS.DELETE_CATALOG),
      onClick: (value: any) => {
        console.log('Eliminar:', value);
      },
    },
  ];

  categoryTecnicalHabilitiesRequest = injectQuery(() => ({
    queryKey: [
      'categoryTecnicalHabilities',
      { page: this.pagination.page(), perPage: this.pagination.perPage() },
    ],
    queryFn: async () => {
      const response = await this.categoryTecnicalHabilitieService.getCategoryTecnicalHabilities({
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
    await this.categoryTecnicalHabilitiesRequest.refetch();
  }

  async paginatePage(pag: PaginationTableOutput) {
    this.pagination.page.set(pag.page);
    this.pagination.perPage.set(pag.perPage);

    await this.categoryTecnicalHabilitiesRequest.refetch();
  }

  constructor() {}
}


