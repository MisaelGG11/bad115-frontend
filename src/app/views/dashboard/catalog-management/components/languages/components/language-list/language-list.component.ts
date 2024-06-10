import { Component, inject, OnInit, signal } from '@angular/core';
import { LanguageService } from '../../../../../../../services/language.service';
import { Store } from '@ngrx/store';
import { Language } from '../../../../../../../interfaces/language.interface';
import { Session } from '../../../../../../../interfaces/user.interface';
import { PERMISSIONS } from '../../../../../../../utils/constants.utils';
import {
  PaginationTableInput,
  PaginationTableOutput,
} from '../../../../../../../interfaces/pagination.interface';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { DataTableComponent } from '../../../../../../../components/data-table/data-table.component';
import { TooltipModule } from 'primeng/tooltip';
import { NgClass } from '@angular/common';
import { EditLanguageComponent } from '../edit-language/edit-language.component';

@Component({
  selector: 'app-language-list',
  standalone: true,
  imports: [DataTableComponent, TooltipModule, NgClass, EditLanguageComponent],
  templateUrl: './language-list.component.html',
})
export class LanguageListComponent implements OnInit {
  private languageService = inject(LanguageService);
  private store = inject(Store);
  showAddModal = signal(false);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  readOnly = signal(false);
  selectedLanguage = signal<Language>({
    id: '',
    language: '',
  });
  sessionValue: Session | undefined;
  columns = [
    { field: 'id', header: 'ID', column_align: 'left', row_align: 'center' },
    { field: 'language', header: 'Idioma', column_align: 'left', row_align: 'center' },
  ];
  dataTable: Language[] = [];
  actionsList: any[] = [];
  permissionUser: string[] = [];
  pagination: PaginationTableInput = {
    total: 0,
    perPage: signal(10),
    page: signal(1),
  };

  languageRequest = injectQuery(() => ({
    queryKey: ['languages'],
    queryFn: async () => {
      const response = await this.languageService.find({
        perPage: this.pagination.perPage(),
        page: this.pagination.page(),
      });

      const { data, pagination } = response;

      this.pagination.total = pagination.totalItems ?? 0;
      this.dataTable = data ?? [];

      return response;
    },
  }));

  async ngOnInit() {
    await this.languageRequest.refetch();
    this.store.select('session').subscribe((session) => {
      this.sessionValue = session;
      this.permissionUser = this.sessionValue?.user?.permissions ?? [];
      this.actionsList = [
        {
          label: 'Visualizar',
          icon: 'visibility',
          iconColor: 'text-blue-500',
          permission: this.permissionUser.includes(PERMISSIONS.READ_ROLE),
          onClick: (value: Language) => {
            this.onClickVisualize(value);
          },
        },
        {
          label: 'Editar',
          icon: 'edit',
          iconColor: 'text-orange',
          permission: this.permissionUser.includes(PERMISSIONS.UPDATE_ROLE),
          onClick: (value: Language) => {
            this.onClickEdit(value);
          },
        },
        {
          label: 'Eliminar',
          icon: 'delete',
          iconColor: 'text-red-600',
          permission: this.permissionUser.includes(PERMISSIONS.DELETE_ROLE),
          onClick: (value: Language) => {
            this.onClickDelete(value);
          },
        },
      ];
    });
  }

  onClickVisualize(value: Language) {
    this.selectedLanguage.set(value);
    this.readOnly.set(true);
    this.showEditModal.set(true);
  }

  onClickEdit(value: Language) {
    this.selectedLanguage.set(value);
    this.readOnly.set(false);
    this.showEditModal.set(true);
  }

  onClickDelete(value: Language) {
    this.selectedLanguage.set(value);
    this.showDeleteModal.set(true);
  }

  async paginatePage(pag: PaginationTableOutput) {
    this.pagination.page.set(pag.page);
    this.pagination.perPage.set(pag.perPage);

    await this.languageRequest.refetch();
  }
}
