import { Component, inject, Input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { JobService } from '../../../../../services/job.service';
import { toast } from 'ngx-sonner';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-delete-job-position',
  standalone: true,
  imports: [ButtonModule, DialogModule],
  templateUrl: './delete-job-position.component.html',
})
export class DeleteJobPositionComponent {
  private jobService = inject(JobService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() jobPositionId = signal('');

  deleteJobPositionMutation = injectMutation(() => ({
    mutationFn: async () => await this.jobService.deleteJobPosition(this.jobPositionId()),
    onSuccess: async () => {
      toast.success('Puesto de trabajo eliminado', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: ['jobPositions'],
      });
    },
  }));

  jobPositionRequest = injectQuery(() => ({
    queryKey: ['job-position', this.jobPositionId()],
    queryFn: () => this.jobService.getJobPosition(this.jobPositionId()),
  }));

  async delete() {
    await this.deleteJobPositionMutation.mutateAsync();
    this.visible.set(false);
  }
}
