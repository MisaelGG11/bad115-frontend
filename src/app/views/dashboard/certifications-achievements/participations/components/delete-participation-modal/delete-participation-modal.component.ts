import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CandidateService } from '../../../../../../services/candidate.service';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { getPersonLocalStorage } from '../../../../../../utils/local-storage.utils';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-delete-participation-modal',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './delete-participation-modal.component.html',
  styles: ``,
})
export class DeleteParticipationModalComponent {
  private candidateService = inject(CandidateService);
  private person = getPersonLocalStorage();
  @Input() visible = signal(false);
  @Input() participationId = signal('');
  queryClient = injectQueryClient();

  constructor() {}

  positionQuery = injectQuery(() => ({
    queryKey: [
      'participations',
      {
        candidateId: this.person.candidateId,
        participationId: this.participationId(),
      },
    ],
    queryFn: async () =>
      await this.candidateService.getParticipation(this.person.candidateId, this.participationId()),
    enabled: !!this.participationId(),
  }));

  deleteParticipationMutation = injectMutation(() => ({
    mutationFn: async () =>
      await this.candidateService.deleteParticipation(
        this.person.candidateId,
        this.participationId(),
      ),
    onSuccess: async () => {
      toast.success('Participación eliminada', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: [
          'participations',
          {
            candidateId: this.person.candidateId,
          },
        ],
        exact: true,
      });
    },
  }));

  async delete() {
    await this.deleteParticipationMutation.mutateAsync();
    this.visible.set(false);
  }

  closeModal() {
    this.visible.set(false);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['participationId'] && !changes['participationId'].isFirstChange()) {
      await this.positionQuery.refetch();
    }
  }
}
