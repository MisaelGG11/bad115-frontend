import { Component, computed, inject, Input, signal, WritableSignal } from '@angular/core';
import { Candidate } from '../../../../../interfaces/person.interface';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { PaginationTableInput } from '../../../../../interfaces/pagination.interface';
import { Router } from '@angular/router';
import { CandidateService } from '../../../../../services/candidate.service';
import { SpinnerComponent } from '../../../../../components/spinner/spinner.component';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidates-list',
  standalone: true,
  imports: [SpinnerComponent, CommonModule, ButtonModule, FormsModule, CardModule],
  templateUrl: './candidates-list.component.html',
  styles: ``,
})
export class CandidatesListComponent {
  private router = inject(Router);
  private candidateService = inject(CandidateService);
  pagination: PaginationTableInput = {
    total: 0,
    perPage: signal(10),
    page: signal(1),
  };
  search: WritableSignal<string> = signal('');

  candidatesRequest = injectInfiniteQuery(() => ({
    queryKey: [
      'candidates-list',
      { page: this.pagination.page(), perPage: this.pagination.perPage() },
    ],
    queryFn: ({ pageParam }) =>
      this.candidateService.getAllCandidates(this.search(), {
        page: pageParam,
        perPage: 5,
      }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    maxPages: 3,
  }));

  #hasNextPage = this.candidatesRequest.hasNextPage;
  #isFetchingNextPage = this.candidatesRequest.isFetchingNextPage;

  nextButtonDisabled = computed(() => !this.#hasNextPage() || this.#isFetchingNextPage());
  nextButtonText = computed(() =>
    this.#isFetchingNextPage()
      ? 'Cargando...'
      : this.#hasNextPage()
        ? 'Cargar más'
        : 'No hay más registros',
  );

  //function to calculate a date
  calculateAge(birthdayCandidate: string): number {
    const birthday = new Date(birthdayCandidate);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  onFilterName() {
    this.candidatesRequest.refetch();
  }

  onShowCandidateProfile(candidateId: string) {
    this.router.navigate(['/dashboard/red-talenthub/perfil-usuario', candidateId]);
  }
}
