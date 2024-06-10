import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import {
  injectQueryClient,
  injectQuery,
  injectMutation,
} from '@tanstack/angular-query-experimental';
import { toast } from 'ngx-sonner';
import { CandidateService } from '../../../../../../services/candidate.service';
import { getPersonLocalStorage } from '../../../../../../utils/local-storage.utils';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-delete-test',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './delete-test.component.html',
  styles: ``,
})
export class DeleteTestComponent {
  private candidateService = inject(CandidateService);
  private person = getPersonLocalStorage();
  @Input() visible = signal(false);
  @Input() testId = signal('');
  queryClient = injectQueryClient();

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['testId'] && !changes['testId'].isFirstChange()) {
      await this.testRequest.refetch();
    }
  }

  testRequest = injectQuery(() => ({
    queryKey: [
      'tests',
      {
        candidateId: this.person.candidateId,
        testId: this.testId(),
      },
    ],
    queryFn: async () =>
      await this.candidateService.getTest(this.person.candidateId, this.testId()),
    enabled: !!this.testId,
  }));

  deleteTestMutation = injectMutation(() => ({
    mutationFn: async () =>
      await this.candidateService.deleteTest(this.person.candidateId, this.testId()),
    onSuccess: async () => {
      toast.success('Prueba eliminada', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: [
          'tests',
          {
            candidateId: this.person.candidateId,
          },
        ],
        exact: true,
      });
    },
  }));

  async delete() {
    await this.deleteTestMutation.mutateAsync();
    this.visible.set(false);
  }

  closeModal() {
    this.visible.set(false);
  }
}
