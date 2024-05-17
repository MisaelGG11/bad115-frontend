import { Component, inject, Input, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CandidateService } from '../../../../../services/candidate.service';
import { injectMutation } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-delete-labor-experience-modal',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule],
  templateUrl: './delete-labor-experience-modal.component.html',
  styles: [],
})
export class DeleteLaborExperienceModalComponent {
  private candidateService = inject(CandidateService);
  @Input() visible = signal(false);
  @Input() laborExperienceId = signal('');

  constructor() {}

  deleteLaborExperienceMutation = injectMutation(() => ({
    mutationFn: async () =>
      await this.candidateService.deleteLaborExperience(this.laborExperienceId()),
  }));

  delete() {
    console.log('delete');
  }
}
