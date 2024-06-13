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
  selector: 'app-delete-language-skills-modal',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './delete-language-skills-modal.component.html',
  styles: ``,
})
export class DeleteLanguageSkillModalComponent {
  private candidateService = inject(CandidateService);
  private person = getPersonLocalStorage();
  @Input() visible = signal(false);
  @Input() LanguageSkillId = signal('');
  queryClient = injectQueryClient();

  constructor() {}

  positionQuery = injectQuery(() => ({
    queryKey: [
      'languageSkills',
      {
        candidateId: this.person.candidateId,
        LanguageSkillId: this.LanguageSkillId(),
      },
    ],
    queryFn: async () =>
      await this.candidateService.getLanguageSkill(this.person.candidateId, this.LanguageSkillId()),
    enabled: !!this.LanguageSkillId(),
  }));

  deleteLanguageSkillMutation = injectMutation(() => ({
    mutationFn: async () =>
      await this.candidateService.deleteLanguageSkill(
        this.person.candidateId,
        this.LanguageSkillId(),
      ),
    onSuccess: async () => {
      toast.success('Habilidad Lingüística eliminada', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: [
          'languageSkills',
          {
            candidateId: this.person.candidateId,
          },
        ],
        exact: true,
      });
    },
  }));

  async delete() {
    await this.deleteLanguageSkillMutation.mutateAsync();
    this.visible.set(false);
  }

  closeModal() {
    this.visible.set(false);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['languageSkillId'] && !changes['languageSkillId'].isFirstChange()) {
      await this.positionQuery.refetch();
    }
  }
}

