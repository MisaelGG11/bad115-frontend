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
  selector: 'app-delete-certification-modal',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './delete-certification-modal.component.html',
  styles: ``,
})
export class DeleteCertificationModalComponent {
  private candidateService = inject(CandidateService);
  private person = getPersonLocalStorage();
  @Input() visible = signal(false);
  @Input() certificationId = signal('');
  queryClient = injectQueryClient();

  constructor() {}

  positionQuery = injectQuery(() => ({
    queryKey: [
      'certifications',
      {
        candidateId: this.person.candidateId,
        certificationId: this.certificationId(),
      },
    ],
    queryFn: async () =>
      await this.candidateService.getCertification(this.person.candidateId, this.certificationId()),
    enabled: !!this.certificationId(),
  }));

  deleteCertificationMutation = injectMutation(() => ({
    mutationFn: async () =>
      await this.candidateService.deleteCertification(
        this.person.candidateId,
        this.certificationId(),
      ),
    onSuccess: async () => {
      toast.success('Certificación eliminada', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: [
          'certifications',
          {
            candidateId: this.person.candidateId,
          },
        ],
        exact: true,
      });
    },
  }));

  async delete() {
    await this.deleteCertificationMutation.mutateAsync();
    this.visible.set(false);
  }

  closeModal() {
    this.visible.set(false);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['certificationId'] && !changes['certificationId'].isFirstChange()) {
      await this.positionQuery.refetch();
    }
  }
}
