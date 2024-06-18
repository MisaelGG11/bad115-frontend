import { Component, inject, signal, WritableSignal } from '@angular/core';
import { JobService } from '../../../services/job.service';
import { GlobalFunctionsService } from '../../../utils/services/global-functions.service';
import {
  PaginationTableInput,
  PaginationTableOutput,
} from '../../../interfaces/pagination.interface';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { getPersonLocalStorage } from '../../../utils/local-storage.utils';
import { PERMISSIONS } from '../../../utils/constants.utils';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../../../components/data-table/data-table.component';
import { JobApplicationJobPosition } from '../../../interfaces/job.interface';
import { VisualizeCandidateApplicationComponent } from './components/visualize-candidate-application/visualize-candidate-application.component';

export interface DataTableCandidateApplication {
  id: string;
  position: string;
  haveMeetings: number;
  status: string;
  application: JobApplicationJobPosition;
}

@Component({
  selector: 'app-candidate-applications',
  standalone: true,
  imports: [
    TooltipModule,
    DataTableComponent,
    VisualizeCandidateApplicationComponent,
    CommonModule,
  ],
  templateUrl: './candidate-applications.component.html',
  styles: ``,
})
export class CandidateApplicationsComponent {
  private jobService = inject(JobService);
  private global = inject(GlobalFunctionsService);
  person = getPersonLocalStorage();
  showVisualizeModal = signal(false);
  selectedJobApplication: WritableSignal<JobApplicationJobPosition | null> = signal(null);
  permissionUser: string[] = this.global.getPermissions();
  filters: any = {
    name: '',
    dui: '',
    passport: '',
  };

  dataTable: DataTableCandidateApplication[] = [];
  pagination: PaginationTableInput = {
    total: 0,
    perPage: signal(10),
    page: signal(1),
  };

  columns = [
    { field: 'id', header: 'ID', column_align: 'left', row_align: 'center' },
    { field: 'position', header: 'Empleo', column_align: 'left', row_align: 'center' },
    {
      field: 'haveMeetings',
      header: 'Reuniones programadas',
      column_align: 'left',
      row_align: 'center',
    },
    { field: 'status', header: 'Estado', column_align: 'left', row_align: 'center' },
  ];

  actionsList: any[] = [];

  applicationsRequest = injectQuery(() => ({
    queryKey: [
      'job-applications-candidates',
      { page: this.pagination.page(), perPage: this.pagination.perPage() },
    ],
    queryFn: async () => {
      const response = await this.jobService.getApplicationsByCandidate(this.person.candidateId, {
        page: this.pagination.page(),
        perPage: this.pagination.perPage(),
      });
      const { data, pagination } = response;
      this.pagination.total = pagination.totalItems ?? 0;
      console.log(data);
      this.dataTable = [];
      data?.forEach((application) => {
        console.log(application);
        this.dataTable.push({
          id: application.id,
          position: application.jobPosition.name,
          status: application.status,
          haveMeetings: application.meeting.length,
          application: application,
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
    ];
  }

  async paginatePage(pag: PaginationTableOutput) {
    this.pagination.page.set(pag.page);
    this.pagination.perPage.set(pag.perPage);

    await this.applicationsRequest.refetch();
  }

  onClickVisualize(value: DataTableCandidateApplication) {
    this.selectedJobApplication.set(value.application);
    this.showVisualizeModal.set(true);
  }
}
