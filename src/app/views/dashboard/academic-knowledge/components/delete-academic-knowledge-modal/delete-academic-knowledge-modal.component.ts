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
  selector: 'app-delete-academic-knowledge-modal',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './delete-academic-knowledge-modal.component.html',
  styles: [],
})
export class DeleteAcademicKnowledgeModalComponent implements OnChanges {
  private candidateService = inject(CandidateService);
  private person = getPersonLocalStorage();
  @Input() visible = signal(false);
  @Input() academicKnowledgeId = signal('');
  queryClient = injectQueryClient();

  constructor() {}

  positionQuery = injectQuery(() => ({
    queryKey: [
      'academicKnowledge',
      {
        candidateId: this.person.candidateId,
        academicKnowledgeId: this.academicKnowledgeId(),
      },
    ],
    queryFn: async () =>
      await this.candidateService.getAcademicKnowledge(
        this.person.candidateId,
        this.academicKnowledgeId(),
      ),
    enabled: !!this.academicKnowledgeId(),
  }));

  deleteAcademicKnowledgeMutation = injectMutation(() => ({
    mutationFn: async () =>
      await this.candidateService.deleteAcademicKnowledge(
        this.person.candidateId,
        this.academicKnowledgeId(),
      ),
    onSuccess: async () => {
      await this.queryClient.invalidateQueries({
        queryKey: [
          'academicKnowledge',
          {
            candidateId: this.person.candidateId,
          },
        ],
        exact: true,
      });
    },
  }));

  async delete() {
    await this.deleteAcademicKnowledgeMutation.mutateAsync();
    this.visible.set(false);
  }

  closeModal() {
    this.visible.set(false);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['academicKnowledgeId'] && !changes['academicKnowledgeId'].isFirstChange()) {
      await this.positionQuery.refetch();
    }
  }
}
