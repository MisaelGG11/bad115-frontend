import { Component, inject, OnInit, signal } from '@angular/core';
import { TechnicalSkillService } from '../../../../../../../services/technical-skill.service';
import { Store } from '@ngrx/store';
import { TechnicalSkill } from '../../../../../../../interfaces/technical-skill.interface';
import { Session } from '../../../../../../../interfaces/user.interface';
import {
  PaginationTableInput,
  PaginationTableOutput,
} from '../../../../../../../interfaces/pagination.interface';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { PERMISSIONS } from '../../../../../../../utils/constants.utils';
import { DataTableComponent } from '../../../../../../../components/data-table/data-table.component';
import { TooltipModule } from 'primeng/tooltip';
import { NgClass } from '@angular/common';

export interface DataTableTechnicalSkill {
  id: string;
  name: string;
  category: string;
}

@Component({
  selector: 'app-technical-skill-list',
  standalone: true,
  imports: [DataTableComponent, TooltipModule, NgClass],
  templateUrl: './technical-skill-list.component.html',
})
export class TechnicalSkillListComponent implements OnInit {
  private recognitionTypeService = inject(TechnicalSkillService);
  private store = inject(Store);
  showAddModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  readOnly = signal(false);
  selectedCatalogTechnicalSkill = signal<TechnicalSkill>({
    id: '',
    name: '',
    categoryTechnicalSkillId: '',
    categoryTechnicalSkill: {
      id: '',
      name: '',
    },
  });
  sessionValue: Session | undefined;
  dataTable: DataTableTechnicalSkill[] = [];
  permissionUser: string[] = [];
  actionsList: any[] = [];
  pagination: PaginationTableInput = {
    total: 0,
    perPage: signal(10),
    page: signal(1),
  };

  columns = [
    { field: 'id', header: 'ID', column_align: 'left', row_align: 'center' },
    { field: 'name', header: 'Nombre', column_align: 'left', row_align: 'center' },
    {
      field: 'category',
      header: 'Categoría',
      column_align: 'left',
      row_align: 'center',
    },
  ];

  technicalSkillsRequest = injectQuery(() => ({
    queryKey: [
      'technicalSkills',
      { page: this.pagination.page(), perPage: this.pagination.perPage() },
    ],
    queryFn: async () => {
      const response = await this.recognitionTypeService.findTechnicalSkill({
        page: this.pagination.page(),
        perPage: this.pagination.perPage(),
      });
      const { data, pagination } = response;

      this.pagination.total = pagination.totalItems ?? 0;
      this.dataTable =
        data.map((technicalSkill) => ({
          name: technicalSkill.name,
          id: technicalSkill.id,
          category: technicalSkill.categoryTechnicalSkill?.name ?? '',
        })) ?? [];

      return response;
    },
  }));

  async ngOnInit() {
    await this.technicalSkillsRequest.refetch();
    this.store.select('session').subscribe((session) => {
      this.sessionValue = session;
      this.permissionUser = this.sessionValue?.user?.permissions ?? [];
      this.actionsList = [
        {
          label: 'Visualizar',
          icon: 'visibility',
          iconColor: 'text-blue-500',
          permission: this.permissionUser.includes(PERMISSIONS.READ_ROLE),
          onClick: (value: TechnicalSkill) => {
            this.onClickVisualize(value);
          },
        },
        {
          label: 'Editar',
          icon: 'edit',
          iconColor: 'text-orange',
          permission: this.permissionUser.includes(PERMISSIONS.UPDATE_ROLE),
          onClick: (value: TechnicalSkill) => {
            this.onClickEdit(value);
          },
        },
        {
          label: 'Eliminar',
          icon: 'delete',
          iconColor: 'text-red-600',
          permission: this.permissionUser.includes(PERMISSIONS.DELETE_ROLE),
          onClick: (value: TechnicalSkill) => {
            this.onClickDelete(value);
          },
        },
      ];
    });
  }

  async paginatePage(pag: PaginationTableOutput) {
    this.pagination.page.set(pag.page);
    this.pagination.perPage.set(pag.perPage);

    await this.technicalSkillsRequest.refetch();
  }

  onClickVisualize(value: TechnicalSkill) {
    this.selectedCatalogTechnicalSkill.set(value);
    this.readOnly.set(true);
    this.showEditModal.set(true);
  }

  onClickEdit(value: TechnicalSkill) {
    this.selectedCatalogTechnicalSkill.set(value);
    this.readOnly.set(false);
    this.showEditModal.set(true);
  }

  onClickDelete(value: TechnicalSkill) {
    this.selectedCatalogTechnicalSkill.set(value);
    this.showDeleteModal.set(true);
  }
}
