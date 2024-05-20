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

@Component({
  selector: 'app-recognitions-list',
  standalone: true,
  imports: [CardModule, DatePipe, TooltipModule, ButtonModule, SpinnerComponent],
  templateUrl: './recognitions-list.component.html',
  styles: ``,
})
export class RecognitionsListComponent {
  private candidateService = inject(CandidateService);
  private person: Person = JSON.parse(localStorage.getItem(LOCAL_STORAGE.PERSON) ?? '');
  @Output() showDeleteDialog = new EventEmitter<string>();
  @Output() showEditDialog = new EventEmitter<string>();

  constructor() {}

  recognitionsRequest = injectInfiniteQuery(() => ({
    queryKey: ['recognitions', { candidateId: this.person.candidateId }],
    queryFn: ({ pageParam }) =>
      this.candidateService.getRecognitions(this.person.candidateId, {
        page: pageParam,
        perPage: 3,
      }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    maxPages: 3,
  }));

  #hasNextPage = this.recognitionsRequest.hasNextPage;
  #isFetchingNextPage = this.recognitionsRequest.isFetchingNextPage;

  nextButtonDisabled = computed(() => !this.#hasNextPage() || this.#isFetchingNextPage());
  nextButtonText = computed(() =>
    this.#isFetchingNextPage()
      ? 'Cargando...'
      : this.#hasNextPage()
        ? 'Cargar más'
        : 'No hay más registros',
  );

  onClickShowEditDialog(recognitionId: string) {
    this.showEditDialog.emit(recognitionId);
  }

  onClickShowDeleteDialog(recognitionId: string) {
    this.showDeleteDialog.emit(recognitionId);
  }

  formatDate(date: Date) {
    return format(date, 'dd/MM/yyyy');
  }
}
