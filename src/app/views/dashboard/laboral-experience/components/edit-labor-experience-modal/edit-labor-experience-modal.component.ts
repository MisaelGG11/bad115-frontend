import { Component, inject, Input, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CandidateService } from '../../../../../services/candidate.service';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { getPersonLocalStorage } from '../../../../../utils/person-local-storage.utils';

@Component({
  selector: 'app-edit-labor-experience-modal',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './edit-labor-experience-modal.component.html',
  styles: [],
})
export class EditLaborExperienceModalComponent {
  private candidateService = inject(CandidateService);
  private person = getPersonLocalStorage();
  @Input() visible = signal(false);
  @Input() laborExperienceId = '';

  constructor() {}

  editLaborExperience = injectMutation(() => ({
    mutationFn: () =>
      this.candidateService.updateLaborExperience(
        this.person.candidateId,
        this.laborExperienceId,
        {},
      ),
  }));
}
