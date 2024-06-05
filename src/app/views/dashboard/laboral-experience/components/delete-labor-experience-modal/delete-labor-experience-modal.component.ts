import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CandidateService } from '../../../../../services/candidate.service';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { getPersonLocalStorage } from '../../../../../utils/local-storage.utils';

@Component({
  selector: 'app-delete-labor-experience-modal',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './delete-labor-experience-modal.component.html',
  styles: [],
})
export class DeleteLaborExperienceModalComponent implements OnChanges {
  private candidateService = inject(CandidateService);
  private person = getPersonLocalStorage();
  @Input() visible = signal(false);
  @Input() laborExperienceId = signal('');
  queryClient = injectQueryClient();

  constructor() {}

  positionQuery = injectQuery(() => ({
    queryKey: [
      'laborExperience',
      {
        candidateId: this.person.candidateId,
        laborExperienceId: this.laborExperienceId(),
      },
    ],
    queryFn: async () =>
      await this.candidateService.getLaborExperience(
        this.person.candidateId,
        this.laborExperienceId(),
      ),
    enabled: !!this.laborExperienceId(),
  }));

  deleteLaborExperienceMutation = injectMutation(() => ({
    mutationFn: async () =>
      await this.candidateService.deleteLaborExperience(
        this.person.candidateId,
        this.laborExperienceId(),
      ),
    onSuccess: async () => {
      await this.queryClient.invalidateQueries({
        queryKey: [
          'laborExperience',
          {
            candidateId: this.person.candidateId,
          },
        ],
        exact: true,
      });
    },
  }));

  async delete() {
    await this.deleteLaborExperienceMutation.mutateAsync();
    this.visible.set(false);
  }

  closeModal() {
    this.visible.set(false);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['laborExperienceId'] && !changes['laborExperienceId'].isFirstChange()) {
      await this.positionQuery.refetch();
    }
  }
}
