import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { format } from 'date-fns';
import { Person } from '../../../../../../interfaces/person.interface';
import { LOCAL_STORAGE } from '../../../../../../utils/constants.utils';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { CandidateService } from '../../../../../../services/candidate.service';
import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from '../../../../../../components/spinner/spinner.component';
import { getPersonLocalStorage } from '../../../../../../utils/local-storage.utils';

@Component({
  selector: 'app-tests-list',
  standalone: true,
  imports: [CardModule, DatePipe, TooltipModule, ButtonModule, SpinnerComponent],
  templateUrl: './tests-list.component.html',
  styles: ``,
})
export class TestsListComponent {
  private candidateService = inject(CandidateService);
  private person: Person = getPersonLocalStorage();
  @Output() showDeleteDialog = new EventEmitter<string>();
  @Output() showEditDialog = new EventEmitter<string>();

  constructor() {}

  testsRequest = injectInfiniteQuery(() => ({
    queryKey: ['tests', { candidateId: this.person.candidateId }],
    queryFn: ({ pageParam }) =>
      this.candidateService.getTests(this.person.candidateId, {
        page: pageParam,
        perPage: 3,
      }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    maxPages: 3,
  }));

  #hasNextPage = this.testsRequest.hasNextPage;
  #isFetchingNextPage = this.testsRequest.isFetchingNextPage;

  nextButtonDisabled = computed(() => !this.#hasNextPage() || this.#isFetchingNextPage());
  nextButtonText = computed(() =>
    this.#isFetchingNextPage()
      ? 'Cargando...'
      : this.#hasNextPage()
        ? 'Cargar más'
        : 'No hay más registros',
  );

  onClickShowEditDialog(testId: string) {
    this.showEditDialog.emit(testId);
  }

  onClickShowDeleteDialog(testId: string) {
    this.showDeleteDialog.emit(testId);
  }

  formatDate(date: Date) {
    return format(date, 'dd/MM/yyyy');
  }
}
