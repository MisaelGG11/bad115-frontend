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
  selector: 'app-delete-recognition-modal',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './delete-recognition-modal.component.html',
  styles: ``,
})
export class DeleteRecognitionModalComponent {
  private candidateService = inject(CandidateService);
  private person = getPersonLocalStorage();
  @Input() visible = signal(false);
  @Input() recognitionId = signal('');
  queryClient = injectQueryClient();

  constructor() {}

  positionQuery = injectQuery(() => ({
    queryKey: [
      'recognitions',
      {
        candidateId: this.person.candidateId,
        recognitionId: this.recognitionId(),
      },
    ],
    queryFn: async () =>
      await this.candidateService.getRecognition(this.person.candidateId, this.recognitionId()),
    enabled: !!this.recognitionId(),
  }));

  deleteRecognitionMutation = injectMutation(() => ({
    mutationFn: async () =>
      await this.candidateService.deleteRecognition(this.person.candidateId, this.recognitionId()),
    onSuccess: async () => {
      toast.success('Reconocimiento eliminado', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: [
          'recognitions',
          {
            candidateId: this.person.candidateId,
          },
        ],
        exact: true,
      });
    },
  }));

  async delete() {
    await this.deleteRecognitionMutation.mutateAsync();
    this.visible.set(false);
  }

  closeModal() {
    this.visible.set(false);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['recognitionId'] && !changes['recognitionId'].isFirstChange()) {
      await this.positionQuery.refetch();
    }
  }
}
