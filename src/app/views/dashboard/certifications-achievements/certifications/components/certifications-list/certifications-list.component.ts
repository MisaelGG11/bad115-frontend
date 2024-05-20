import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { Person } from '../../../../../../interfaces/person.interface';
import { LOCAL_STORAGE } from '../../../../../../utils/constants.utils';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { CandidateService } from '../../../../../../services/candidate.service';
import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from '../../../../../../components/spinner/spinner.component';

@Component({
  selector: 'app-certifications-list',
  standalone: true,
  imports: [
    CardModule,
    DatePipe,
    TooltipModule,
    ButtonModule,
    SpinnerComponent
  ],
  templateUrl: './certifications-list.component.html',
  styles: ``
})
export class CertificationsListComponent {
  private candidateService = inject(CandidateService);
  private person: Person = JSON.parse(localStorage.getItem(LOCAL_STORAGE.PERSON) ?? '');
  @Output() showDeleteDialog = new EventEmitter<string>();
  @Output() showEditDialog = new EventEmitter<string>();

  constructor() {}

  certificationsRequest = injectInfiniteQuery(() => ({
    queryKey: ['certifications', { candidateId: this.person.candidateId }],
    queryFn: ({ pageParam }) =>
      this.candidateService.getCertifications(this.person.candidateId, {
        page: pageParam,
        perPage: 3,
      }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    maxPages: 3,
  }));

  #hasNextPage = this.certificationsRequest.hasNextPage;
  #isFetchingNextPage = this.certificationsRequest.isFetchingNextPage;

  nextButtonDisabled = computed(() => !this.#hasNextPage() || this.#isFetchingNextPage());
  nextButtonText = computed(() =>
    this.#isFetchingNextPage()
      ? 'Cargando...'
      : this.#hasNextPage()
        ? 'Cargar más'
        : 'No hay más registros',
  );

  onClickShowEditDialog(laborExperienceId: string) {
    this.showEditDialog.emit(laborExperienceId);
  }

  onClickShowDeleteDialog(laborExperienceId: string) {
    this.showDeleteDialog.emit(laborExperienceId);
  }
}
