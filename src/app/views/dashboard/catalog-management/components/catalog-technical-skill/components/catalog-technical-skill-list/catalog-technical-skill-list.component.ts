import { Component, inject, OnInit, signal } from '@angular/core';
import {
  PaginationTableInput,
  PaginationTableOutput,
} from '../../../../../../../interfaces/pagination.interface';
import { TechnicalSkillService } from '../../../../../../../services/technical-skill.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { CatalogTechnicalSkill } from '../../../../../../../interfaces/technical-skill.interface';
import { Store } from '@ngrx/store';
import { Role, Session } from '../../../../../../../interfaces/user.interface';
import { PERMISSIONS } from '../../../../../../../utils/constants.utils';
import { DataTableComponent } from '../../../../../../../components/data-table/data-table.component';
import { DeleteRoleComponent } from '../../../../../role-management/components/delete-role/delete-role.component';
import { EditRoleComponent } from '../../../../../role-management/components/edit-role/edit-role.component';
import { TooltipModule } from 'primeng/tooltip';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-catalog-technical-skill-list',
  standalone: true,
  imports: [DataTableComponent, DeleteRoleComponent, EditRoleComponent, TooltipModule, NgClass],
  templateUrl: './catalog-technical-skill-list.component.html',
})
export class CatalogTechnicalSkillListComponent implements OnInit {
  private recognitionTypeService = inject(TechnicalSkillService);
  private store = inject(Store);
  showAddModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  showDetailsModal = signal(false);
  selectedCatalogTechnicalSkill = signal<CatalogTechnicalSkill>({
    id: '',
    name: '',
  });
  sessionValue: Session | undefined;
  dataTable: CatalogTechnicalSkill[] = [];
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
  ];

  catalogTechnicalSkillsRequest = injectQuery(() => ({
    queryKey: [
      'catalogTechnicalSkills',
      { page: this.pagination.page(), perPage: this.pagination.perPage() },
    ],
    queryFn: async () => {
      const response = await this.recognitionTypeService.findCatalog({
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
    await this.catalogTechnicalSkillsRequest.refetch();
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

    await this.catalogTechnicalSkillsRequest.refetch();
  }

  onClickVisualize(value: CatalogTechnicalSkill) {
    this.selectedCatalogTechnicalSkill.set(value);
    this.showDetailsModal.set(true);
  }

  onClickEdit(value: Role) {
    this.selectedCatalogTechnicalSkill.set(value);
    this.showEditModal.set(true);
  }

  onClickDelete(value: Role) {
    this.selectedCatalogTechnicalSkill.set(value);
    this.showDeleteModal.set(true);
  }
}
