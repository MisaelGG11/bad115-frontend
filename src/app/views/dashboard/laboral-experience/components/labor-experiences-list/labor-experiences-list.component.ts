import { Component, computed, inject, Input } from '@angular/core';
import { Person } from '../../../../../interfaces/person.interface';
import { LOCAL_STORAGE } from '../../../../../utils/constants.utils';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { CandidateService } from '../../../../../services/candidate.service';
import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from '../../../../../components/spinner/spinner.component';
import { InputErrorsComponent } from '../../../../../components/inputs/input-errors/input-errors.component';

@Component({
  selector: 'app-labor-experiences-list',
  standalone: true,
  imports: [
    CardModule,
    DatePipe,
    TooltipModule,
    ButtonModule,
    SpinnerComponent,
    InputErrorsComponent,
  ],
  templateUrl: './labor-experiences-list.component.html',
  styles: `
    .red-icon {
      color: red;
    }

    .orange-icon {
      color: orange;
    }
  `,
})
export class LaborExperiencesListComponent {
  private candidateService = inject(CandidateService);
  private person: Person = JSON.parse(localStorage.getItem(LOCAL_STORAGE.PERSON) ?? '');

  constructor() {}

  laborExperienceRequest = injectInfiniteQuery(() => ({
    queryKey: ['laborExperience', { candidateId: this.person.candidateId }],
    queryFn: ({ pageParam }) =>
      this.candidateService.getLaborExperiences(this.person.candidateId, {
        page: pageParam,
        perPage: 3,
      }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    maxPages: 3,
  }));

  #hasNextPage = this.laborExperienceRequest.hasNextPage;
  #isFetchingNextPage = this.laborExperienceRequest.isFetchingNextPage;

  nextButtonDisabled = computed(() => !this.#hasNextPage() || this.#isFetchingNextPage());
  nextButtonText = computed(() =>
    this.#isFetchingNextPage()
      ? 'Cargando...'
      : this.#hasNextPage()
        ? 'Cargar más'
        : 'No hay más registros',
  );

  @Input() showEditDialog!: (laborExperienceId: string) => void;
  @Input() showDeleteDialog!: (laborExperienceId: string) => void;
}
