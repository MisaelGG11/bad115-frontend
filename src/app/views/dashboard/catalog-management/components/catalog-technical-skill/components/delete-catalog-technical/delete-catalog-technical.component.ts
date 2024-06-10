import { Component, inject, Input, signal } from '@angular/core';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { TechnicalSkillService } from '../../../../../../../services/technical-skill.service';
import { CatalogTechnicalSkill } from '../../../../../../../interfaces/technical-skill.interface';
import { toast } from 'ngx-sonner';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-detele-catalog-technical',
  standalone: true,
  imports: [ButtonModule, DialogModule],
  templateUrl: './delete-catalog-technical.component.html',
})
export class DeleteCatalogTechnicalComponent {
  private technicalSkillService = inject(TechnicalSkillService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() catalogTechnicalSkill!: CatalogTechnicalSkill;

  deleteCategoryTechnicalSkillMutation = injectMutation(() => ({
    mutationFn: async () => this.technicalSkillService.deleteCatalog(this.catalogTechnicalSkill.id),
    onSuccess: async () => {
      toast.success('Categoria eliminada', { duration: 3000 }),
        await this.queryClient.invalidateQueries({
          queryKey: ['catalogTechnicalSkills'],
        });
    },
  }));

  async delete() {
    await this.deleteCategoryTechnicalSkillMutation.mutateAsync();
    this.visible.set(false);
  }
}
