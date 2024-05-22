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
  selector: 'app-participations-list',
  standalone: true,
  imports: [CardModule, DatePipe, TooltipModule, ButtonModule, SpinnerComponent],
  templateUrl: './participations-list.component.html',
  styles: ``,
})
export class ParticipationsListComponent {
  private candidateService = inject(CandidateService);
  private person: Person = JSON.parse(localStorage.getItem(LOCAL_STORAGE.PERSON) ?? '');
  @Output() showDeleteDialog = new EventEmitter<string>();
  @Output() showEditDialog = new EventEmitter<string>();

  constructor() {}

  participationsRequest = injectInfiniteQuery(() => ({
    queryKey: ['participations', { candidateId: this.person.candidateId }],
    queryFn: ({ pageParam }) =>
      this.candidateService.getParticipations(this.person.candidateId, {
        page: pageParam,
        perPage: 3,
      }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    maxPages: 3,
  }));

  #hasNextPage = this.participationsRequest.hasNextPage;
  #isFetchingNextPage = this.participationsRequest.isFetchingNextPage;

  nextButtonDisabled = computed(() => !this.#hasNextPage() || this.#isFetchingNextPage());
  nextButtonText = computed(() =>
    this.#isFetchingNextPage()
      ? 'Cargando...'
      : this.#hasNextPage()
        ? 'Cargar más'
        : 'No hay más registros',
  );

  onClickShowEditDialog(participationId: string) {
    this.showEditDialog.emit(participationId);
  }

  onClickShowDeleteDialog(participationId: string) {
    this.showDeleteDialog.emit(participationId);
  }

  formatDate(date: Date) {
    return format(date, 'dd/MM/yyyy');
  }

  participationIcon(type: string) {
    switch (type) {
      case 'Congreso':
        return 'meeting_room';
      case 'Taller':
        return 'groups';
      case 'Foro':
        return 'forum';
      case 'Cumbre':
        return 'diversity_3';
      default:
        return 'pi pi-question';
    }
  }
}
