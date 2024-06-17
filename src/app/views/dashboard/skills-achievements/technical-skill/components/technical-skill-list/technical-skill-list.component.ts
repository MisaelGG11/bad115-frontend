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
  selector: 'app-technical-skill-list',
  standalone: true,
  imports: [CardModule, DatePipe, TooltipModule, ButtonModule, SpinnerComponent],
  templateUrl: './technical-skill-list.component.html',
  styles: ``,
})
export class TechnicalSkillListComponent {
  private candidateService = inject(CandidateService);
  private person: Person = JSON.parse(localStorage.getItem(LOCAL_STORAGE.PERSON) ?? '');
  @Output() showDeleteDialog = new EventEmitter<string>();

  constructor() {}

  technicalSkillsRequest = injectInfiniteQuery(() => ({
    queryKey: ['technicalSkills', { candidateId: this.person.candidateId }],
    queryFn: ({ pageParam }) =>
      this.candidateService.getTechnicalSkills(this.person.candidateId, {
        page: pageParam,
        perPage: 4,
      }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    maxPages: 3,
  }));

  #hasNextPage = this.technicalSkillsRequest.hasNextPage;
  #isFetchingNextPage = this.technicalSkillsRequest.isFetchingNextPage;

  nextButtonDisabled = computed(() => !this.#hasNextPage() || this.#isFetchingNextPage());
  nextButtonText = computed(() =>
    this.#isFetchingNextPage()
      ? 'Cargando...'
      : this.#hasNextPage()
        ? 'Cargar más'
        : 'No hay más registros',
  );

  /*   onClickShowEditDialog(technicalSkillId: string) {
    this.showEditDialog.emit(technicalSkillId);
  } */

  onClickShowDeleteDialog(technicalSkillId: string) {
    this.showDeleteDialog.emit(technicalSkillId);
  }

  SkillIcon(type: string) {
    switch (type) {
        case 'Database':
          return 'storage';
        case 'Frontend':
          return 'code';
        case 'Backend':
          return 'developer_board';
        case 'Mobile':
          return 'smartphone';
        case 'Other':
          return 'extension';
        case 'Testing':
          return 'bug_report';
        case 'Design':
          return 'palette';
        case 'DevOps':
          return 'settings';
        default:
          return 'build';
      }
    }
  }
