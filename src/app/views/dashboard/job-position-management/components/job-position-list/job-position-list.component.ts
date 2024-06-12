import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { Person } from '../../../../../interfaces/person.interface';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';

import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from '../../../../../components/spinner/spinner.component';
import {
  getCompanyLocalStorage,
  getPersonLocalStorage,
} from '../../../../../utils/local-storage.utils';
import { Company } from '../../../../../interfaces/company.interface';
import { JobService } from '../../../../../services/job.service';

@Component({
  selector: 'app-job-position-list',
  standalone: true,
  imports: [CardModule, DatePipe, TooltipModule, ButtonModule, SpinnerComponent],
  templateUrl: './job-position-list.component.html',
  styles: ``,
})
export class JobPositionListComponent {
  private jobService = inject(JobService);
  private person: Person = getPersonLocalStorage();
  private company: Company = getCompanyLocalStorage();
  @Output() showDeleteDialog = new EventEmitter<string>();
  @Output() showEditDialog = new EventEmitter<string>();
  @Output() showVisualizePage = new EventEmitter<string>();

  constructor() {}

  jobPositionsRequest = injectInfiniteQuery(() => ({
    queryKey: ['job-positions'],
    queryFn: ({ pageParam }) =>
      this.jobService.getJobPositionsRecruiter(this.person.recruiterId, {
        page: pageParam,
        perPage: 5,
      }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    maxPages: 3,
  }));

  #hasNextPage = this.jobPositionsRequest.hasNextPage;
  #isFetchingNextPage = this.jobPositionsRequest.isFetchingNextPage;

  nextButtonDisabled = computed(() => !this.#hasNextPage() || this.#isFetchingNextPage());
  nextButtonText = computed(() =>
    this.#isFetchingNextPage()
      ? 'Cargando...'
      : this.#hasNextPage()
        ? 'Cargar más'
        : 'No hay más registros',
  );

  onClickShowEditDialog(jobPositionId: string) {
    this.showEditDialog.emit(jobPositionId);
  }

  onClickShowDeleteDialog(jobPositionId: string) {
    this.showDeleteDialog.emit(jobPositionId);
  }

  onClickShowVisualizePage(jobPositionId: string) {
    this.showVisualizePage.emit(jobPositionId);
  }

  getModality(modality: string) {
    //ON_SITE, REMOTE, HYBRID
    switch (modality) {
      case 'ON_SITE':
        return 'Presencial';
      case 'REMOTE':
        return 'Remoto';
      case 'HYBRID':
        return 'Híbrido';
      default:
        return '';
    }
  }

  getLevelExperience(level: string) {
    //LESS_ONE_YEAR, ONE_TO_THREE_YEARS, THREE_TO_FIVE_YEARS, MORE_FIVE_YEARS
    switch (level) {
      case 'LESS_ONE_YEAR':
        return 'Menos de un año';
      case 'ONE_TO_THREE_YEARS':
        return 'De 1 a 3 años';
      case 'THREE_TO_FIVE_YEARS':
        return 'De 3 a 5 años';
      case 'MORE_FIVE_YEARS':
        return 'Más de 5 años';
      default:
        return '';
    }
  }

  getContractType(contractType: string) {
    // INTERNSHIP, TEMPORARY, CONTRACTOR, PERMANENT, VOLUNTEER, BY_PROJECT
    switch (contractType) {
      case 'INTERNSHIP':
        return 'Pasantía';
      case 'TEMPORARY':
        return 'Temporal';
      case 'CONTRACTOR':
        return 'Contratista';
      case 'PERMANENT':
        return 'Permanente';
      case 'VOLUNTEER':
        return 'Voluntario';
      case 'BY_PROJECT':
        return 'Por proyecto';
      default:
        return '';
    }
  }

  getWorkday(workday: string) {
    // FULL_TIME, PART_TIME, INTERMITTENT
    switch (workday) {
      case 'FULL_TIME':
        return 'Tiempo completo';
      case 'PART_TIME':
        return 'Medio tiempo';
      case 'INTERMITTENT':
        return 'Intermitente';
      default:
        return '';
    }
  }
}
