import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CompanyService } from '../../../../../services/company.service';
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
import { Recruiter } from '../../../../../interfaces/person.interface';
import { getCompanyLocalStorage } from '../../../../../utils/local-storage.utils';

export interface DataTableRecruiter {
  id: string;
  email: string;
  name: string;
  lastName: string;
  sex: string;
}

@Component({
  selector: 'app-recruiter-list',
  standalone: true,
  imports: [DataTableComponent, TooltipModule, NgClass],
  templateUrl: './recruiter-list.component.html',
  styles: [],
})
export class RecruiterListComponent implements OnInit {
  private companyService = inject(CompanyService);
  private store = inject(Store);
  company = getCompanyLocalStorage();
  showAddModal = signal(false);
  showVisualizeModal = signal(false);
  showDeleteModal = signal(false);
  selectedRecruiter!: WritableSignal<Recruiter>;
  sessionValue: Session | undefined;
  permissionUser: string[] = [];

  dataTable: DataTableRecruiter[] = [];
  pagination: PaginationTableInput = {
    total: 0,
    perPage: signal(10),
    page: signal(1),
  };

  columns = [
    { field: 'id', header: 'ID', column_align: 'left', row_align: 'center' },
    { field: 'name', header: 'Nombres', column_align: 'left', row_align: 'center' },
    { field: 'lastName', header: 'Apellidos', column_align: 'left', row_align: 'center' },
    { field: 'email', header: 'Correo electrónico', column_align: 'left', row_align: 'center' },
    { field: 'sex', header: 'Sexo', column_align: 'left', row_align: 'center' },
  ];

  actionsList: any[] = [];

  recruitersRequest = injectQuery(() => ({
    queryKey: [
      'company-recruiters',
      { page: this.pagination.page(), perPage: this.pagination.perPage() },
    ],
    queryFn: async () => {
      const response = await this.companyService.findCompanyRecruiters(this.company.id, {
        page: this.pagination.page(),
        perPage: this.pagination.perPage(),
      });
      const { data, pagination } = response;
      this.pagination.total = pagination.totalItems ?? 0;
      this.dataTable = [];
      data?.forEach((recruiter) => {
        this.dataTable.push({
          id: recruiter.id,
          email: recruiter.user.email,
          name: [recruiter.firstName, recruiter.middleName].join(' '),
          lastName: [recruiter.lastName, recruiter.secondLastName].join(' '),
          sex: recruiter.gender === 'M' ? 'Masculino' : 'Femenino',
        });
      });

      return response;
    },
  }));

  async ngOnInit() {
    await this.recruitersRequest.refetch();
    this.store.select('session').subscribe((session) => {
      this.sessionValue = session;
      this.permissionUser = this.sessionValue?.user?.permissions ?? [];
      this.actionsList = [
        {
          label: 'Visualizar',
          icon: 'visibility',
          iconColor: 'text-blue-500',
          permission: this.permissionUser.includes(PERMISSIONS.UPDATE_COMPANY),
          onClick: (value: Recruiter) => {
            this.onClickVisualize(value);
          },
        },
        {
          label: 'Eliminar',
          icon: 'delete',
          iconColor: 'text-red-600',
          permission: this.permissionUser.includes(PERMISSIONS.DELETE_COMPANY),
          onClick: (value: Recruiter) => {
            this.onClickDelete(value);
          },
        },
      ];
    });
  }

  async paginatePage(pag: PaginationTableOutput) {
    this.pagination.page.set(pag.page);
    this.pagination.perPage.set(pag.perPage);

    await this.recruitersRequest.refetch();
  }

  onClickVisualize(value: Recruiter) {
    this.selectedRecruiter.set(value);
    this.showVisualizeModal.set(true);
  }

  onClickDelete(value: Recruiter) {
    this.selectedRecruiter.set(value);
    this.showDeleteModal.set(true);
  }

  constructor() {}
}
