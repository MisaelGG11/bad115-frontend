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
import { getPersonLocalStorage } from '../../../../../../utils/person-local-storage.utils';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-delete-publication-modal',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './delete-publication-modal.component.html',
  styles: ``,
})
export class DeletePublicationModalComponent {
  private candidateService = inject(CandidateService);
  private person = getPersonLocalStorage();
  @Input() visible = signal(false);
  @Input() publicationId = signal('');
  queryClient = injectQueryClient();

  constructor() {}

  positionQuery = injectQuery(() => ({
    queryKey: [
      'publications',
      {
        candidateId: this.person.candidateId,
        publicationId: this.publicationId(),
      },
    ],
    queryFn: async () =>
      await this.candidateService.getPublication(this.person.candidateId, this.publicationId()),
    enabled: !!this.publicationId(),
  }));

  deletePublicationMutation = injectMutation(() => ({
    mutationFn: async () =>
      await this.candidateService.deletePublication(this.person.candidateId, this.publicationId()),
    onSuccess: async () => {
      toast.success('Publicación eliminada', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: [
          'publications',
          {
            candidateId: this.person.candidateId,
          },
        ],
        exact: true,
      });
    },
  }));

  async delete() {
    await this.deletePublicationMutation.mutateAsync();
    this.visible.set(false);
  }

  closeModal() {
    this.visible.set(false);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['publicationId'] && !changes['publicationId'].isFirstChange()) {
      await this.positionQuery.refetch();
    }
  }
}
