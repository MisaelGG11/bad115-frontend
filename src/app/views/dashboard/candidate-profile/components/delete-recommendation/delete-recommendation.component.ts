import { Component, inject, Input, signal } from '@angular/core';
import { Recommendation } from '../../../../../interfaces/candidate.interface';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { CandidateService } from '../../../../../services/candidate.service';
import { toast } from 'ngx-sonner';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-delete-recommendation',
  standalone: true,
  imports: [ButtonModule, DialogModule],
  templateUrl: './delete-recommendation.component.html',
  styles: ``,
})
export class DeleteRecommendationComponent {
  private candidateService = inject(CandidateService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() candidateId: string = '';
  @Input() recommendation: Recommendation | null = null;

  deleteRecommendationMutation = injectMutation(() => ({
    mutationFn: async () =>
      this.candidateService.deleteRecommendation(this.candidateId, this.recommendation?.id || ''),
    onSuccess: async () => {
      toast.success('Recomendación eliminada', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: ['candidates'],
      });
    },
  }));

  async delete() {
    await this.deleteRecommendationMutation.mutateAsync();
    this.visible.set(false);
  }
}
