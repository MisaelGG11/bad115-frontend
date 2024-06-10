import { Component, inject, Input, signal } from '@angular/core';
import { TechnicalSkillService } from '../../../../../../../services/technical-skill.service';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TechnicalSkill } from '../../../../../../../interfaces/technical-skill.interface';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-delete-technical-skill',
  standalone: true,
  imports: [ButtonModule, DialogModule],
  templateUrl: './delete-technical-skill.component.html',
})
export class DeleteTechnicalSkillComponent {
  private technicalSkillService = inject(TechnicalSkillService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() technicalSkill!: TechnicalSkill;

  deleteTechnicalSkillMutation = injectMutation(() => ({
    mutationFn: async () => this.technicalSkillService.deleteTechnicalSkill(this.technicalSkill.id),
    onSuccess: async () => {
      toast.success('Habilidad técnica eliminada', { duration: 3000 });
      await Promise.all([
        this.queryClient.invalidateQueries({
          queryKey: ['technicalSkills'],
        }),
        this.queryClient.invalidateQueries({
          queryKey: ['catalogTechnicalSkills'],
        }),
      ]);
    },
  }));

  async delete() {
    await this.deleteTechnicalSkillMutation.mutateAsync();
    this.visible.set(false);
  }
}
