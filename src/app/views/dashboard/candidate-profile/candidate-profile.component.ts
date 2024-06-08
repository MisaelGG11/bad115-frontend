import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { CandidateDetails } from '../../../interfaces/candidate.interface';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../../../services/candidate.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [CommonModule, DialogModule, SpinnerComponent],
  templateUrl: './candidate-profile.component.html',
  styles: ``,
})
export class CandidateProfileComponent {
  private route = inject(ActivatedRoute);
  private candidateService = inject(CandidateService);
  @Input() visible = signal(false);
  @Input() candidateId = this.route.snapshot.params['candidateId'];
  profile!: CandidateDetails;

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['candidateId'] && !changes['candidateId'].isFirstChange()) {
      await this.candidateRequest.refetch();
    }
  }

  candidateRequest = injectQuery(() => ({
    queryKey: ['candidates'],
    queryFn: async () =>
      (this.profile = await this.candidateService.getCandidate(this.candidateId)),
    enabled: !!this.candidateId,
  }));
}
