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
  selector: 'app-delete-technical-skill-modal',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './delete-technical-skill-modal.component.html',
  styles: ``,
})
export class DeleteTechnicalSkillModalComponent {
  private candidateService = inject(CandidateService);
  private person = getPersonLocalStorage();
  @Input() visible = signal(false);
  @Input() technicalSkillId = signal('');
  queryClient = injectQueryClient();

  constructor() {}

  positionQuery = injectQuery(() => ({
    queryKey: [
      'TechnicalSkills',
      {
        candidateId: this.person.candidateId,
        technicalSkillId: this.technicalSkillId(),
      },
    ],
    queryFn: async () =>
      await this.candidateService.getTechnicalSkill(this.person.candidateId, this.technicalSkillId()),
    enabled: !!this.technicalSkillId(),
  }));

  deleteTechnicalSkillMutation = injectMutation(() => ({
    mutationFn: async () =>
      await this.candidateService.deleteTechnicalSkill(this.person.candidateId, this.technicalSkillId()),
    onSuccess: async () => {
      toast.success('Habilidad Técnica eliminado', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: [
          'TechnicalSkills',
          {
            candidateId: this.person.candidateId,
          },
        ],
        exact: true,
      });
    },
  }));

  async delete() {
    await this.deleteTechnicalSkillMutation.mutateAsync();
    this.visible.set(false);
  }

  closeModal() {
    this.visible.set(false);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['technicalSkillId'] && !changes['technicalSkillId'].isFirstChange()) {
      await this.positionQuery.refetch();
    }
  }
}


