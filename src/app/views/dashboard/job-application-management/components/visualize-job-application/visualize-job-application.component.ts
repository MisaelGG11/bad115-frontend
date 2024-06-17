import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { JobApplicationCandidate } from '../../../../../interfaces/job.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { DatePipe } from '@angular/common';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { JobService } from '../../../../../services/job.service';

@Component({
  selector: 'app-visualize-job-application',
  standalone: true,
  imports: [RouterLink, DatePipe, CommonModule, DialogModule],
  templateUrl: './visualize-job-application.component.html',
  styles: ``,
})
export class VisualizeJobApplicationComponent {
  private jobService = inject(JobService);
  @Input() visible = signal(false);
  @Input() jobApplicationId: string = '';
  jobApplication: any = null;

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['jobApplicationId'] && !changes['jobApplicationId'].isFirstChange()) {
      await this.jobApplicationRequest.refetch();
    }
  }

  jobApplicationRequest = injectQuery(() => ({
    queryKey: [
      'job-applications',
      {
        jobApplicationId: this.jobApplicationId,
      },
    ],
    queryFn: async () => {
      const data = await this.jobService.getJobApplication(this.jobApplicationId);
      this.jobApplication = data;

      return data;
    },
    enabled: !!this.jobApplicationId,
  }));

  colorPercentage(percentage: number = 0) {
    if (percentage >= 90) {
      return 'bg-green-500';
    }
    if (percentage >= 80) {
      return 'bg-teal-500';
    }
    if (percentage >= 70) {
      return 'bg-blue-500';
    }
    if (percentage >= 55) {
      return 'bg-violet-500';
    }
    if (percentage < 30) {
      return 'bg-red-500';
    }
    if (percentage < 45) {
      return 'bg-orange';
    }
    if (percentage < 55) {
      return 'bg-yellow-300';
    }
    return 'bg-slate-500';
  }

  async resetJobApplication() {
    await this.jobApplicationRequest.refetch();
  }
}
