import { Component, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import {
  PaginationTableInput,
  PaginationTableOutput,
} from '../../../../../interfaces/pagination.interface';
import { PERMISSIONS } from '../../../../../utils/constants.utils';
import { DataTableComponent } from '../../../../../components/data-table/data-table.component';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { GlobalFunctionsService } from '../../../../../utils/services/global-functions.service';
import { JobService } from '../../../../../services/job.service';
import { ActivatedRoute } from '@angular/router';
import { Document } from '../../../../../interfaces/person.interface';
import { CreateMeetingComponent } from '../create-meeting/create-meeting.component';
import { EditJobApplicationComponent } from '../edit-job-application/edit-job-application.component';
import { VisualizeJobApplicationComponent } from '../visualize-job-application/visualize-job-application.component';

export interface DataTableApplication {
  id: string;
  name: string;
  lastName: string;
  dui: string;
  passport: string;
  percentage: number;
  status: string;
}

@Component({
  selector: 'app-job-applications-list',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    DropdownModule,
    DataTableComponent,
    TooltipModule,
    CommonModule,
    CreateMeetingComponent,
    EditJobApplicationComponent,
    VisualizeJobApplicationComponent,
  ],
  templateUrl: './job-applications-list.component.html',
  styles: ``,
})
export class JobApplicationsListComponent {
  private jobService = inject(JobService);
  private global = inject(GlobalFunctionsService);
  private route = inject(ActivatedRoute);
  showEditModal = signal(false);
  showAddMeetingModal = signal(false);
  showVisualizeModal = signal(false);
  selectedJobApplicationId = signal('');
  permissionUser: string[] = this.global.getPermissions();
  filters: any = {
    name: '',
    dui: '',
    passport: '',
  };

  dataTable: DataTableApplication[] = [];
  pagination: PaginationTableInput = {
    total: 0,
    perPage: signal(10),
    page: signal(1),
  };

  columns = [
    { field: 'id', header: 'ID', column_align: 'left', row_align: 'center' },
    { field: 'name', header: 'Nombres', column_align: 'left', row_align: 'center' },
    { field: 'lastName', header: 'Apellidos', column_align: 'left', row_align: 'center' },
    { field: 'dui', header: 'DUI', column_align: 'left', row_align: 'center' },
    { field: 'passport', header: 'Pasaporte', column_align: 'left', row_align: 'center' },
    {
      field: 'percentage',
      header: 'Grado de compatibilidad',
      column_align: 'left',
      row_align: 'center',
    },
    { field: 'status', header: 'Estado', column_align: 'left', row_align: 'center' },
  ];

  actionsList: any[] = [];

  applicationsRequest = injectQuery(() => ({
    queryKey: [
      'job-applications',
      { page: this.pagination.page(), perPage: this.pagination.perPage() },
    ],
    queryFn: async () => {
      const response = await this.jobService.getApplicationsByJobPosition(
        this.route.snapshot.params['jobPositionId'],
        {
          page: this.pagination.page(),
          perPage: this.pagination.perPage(),
        },
        { ...this.filters },
      );
      const { data, pagination } = response;
      this.pagination.total = pagination.totalItems ?? 0;
      console.log(data);
      this.dataTable = [];
      data?.forEach((application) => {
        const dui = application.candidate.person.documents?.find(
          (doc: Document) => doc.type === 'DUI',
        );
        const passport = application.candidate.person.documents?.find(
          (doc: Document) => doc.type === 'PASSPORT',
        );
        this.dataTable.push({
          id: application.id,
          name: [application.candidate.person.firstName, application.candidate.person.middleName]
            .filter(Boolean)
            .join(' '),
          lastName: [
            application.candidate.person.lastName,
            application.candidate.person.secondLastName,
          ].join(' '),
          status: application.status,
          dui: dui ? dui.number : '-',
          passport: passport ? passport.number : '-',
          percentage: application.percentage * 100,
        });
      });

      return response;
    },
  }));

  async ngOnInit() {
    await this.applicationsRequest.refetch();
    this.actionsList = [
      {
        label: 'Visualizar',
        icon: 'visibility',
        iconColor: 'text-blue-500',
        permission: this.permissionUser.includes(PERMISSIONS.READ_APPLICATION),
        onClick: (value: any) => {
          this.onClickVisualize(value);
        },
      },
      {
        label: 'Agendar reunión',
        icon: 'event',
        iconColor: 'text-green-500',
        permission: this.permissionUser.includes(PERMISSIONS.UPDATE_APPLICATION),
        onClick: (value: any) => {
          this.onClickAddMeeting(value);
        },
      },
      {
        label: 'Actualizar aplicación',
        icon: 'update',
        iconColor: 'text-orange',
        permission: this.permissionUser.includes(PERMISSIONS.UPDATE_APPLICATION),
        onClick: (value: any) => {
          this.onClickEdit(value);
        },
      },
    ];
  }

  async paginatePage(pag: PaginationTableOutput) {
    this.pagination.page.set(pag.page);
    this.pagination.perPage.set(pag.perPage);

    await this.applicationsRequest.refetch();
  }

  onClickVisualize(value: DataTableApplication) {
    this.selectedJobApplicationId.set(value.id);
    this.showVisualizeModal.set(true);
  }

  onClickEdit(value: DataTableApplication) {
    this.selectedJobApplicationId.set(value.id);
    this.showEditModal.set(true);
  }

  onClickAddMeeting(value: DataTableApplication) {
    this.selectedJobApplicationId.set(value.id);
    this.showAddMeetingModal.set(true);
  }

  async onFilterDUI() {
    await this.applicationsRequest.refetch();
  }

  async onFilterPassport() {
    await this.applicationsRequest.refetch();
  }

  async onFilterName() {
    await this.applicationsRequest.refetch();
  }

  onClearFilters() {
    this.filters = {
      name: '',
      dui: '',
      passport: '',
    };
  }
}
