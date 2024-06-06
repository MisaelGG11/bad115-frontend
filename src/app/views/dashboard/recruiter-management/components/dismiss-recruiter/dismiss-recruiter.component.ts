import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { CompanyService } from '../../../../../services/company.service';
import { getCompanyLocalStorage } from '../../../../../utils/local-storage.utils';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { toast } from 'ngx-sonner';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dismiss-recruiter',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './dismiss-recruiter.component.html',
  styles: ``,
})
export class DismissRecruiterComponent {
  private companyService = inject(CompanyService);
  private company = getCompanyLocalStorage();
  @Input() visible = signal(false);
  @Input() recruiterId = '';
  @Input() recruiterName = '';
  queryClient = injectQueryClient();

  constructor() {
    console.log('DismissRecruiterComponent');
  }

  dismissRecruiterMutation = injectMutation(() => ({
    mutationFn: async () =>
      await this.companyService.dismissRecruiter(this.company.id, this.recruiterId),
    onSuccess: async () => {
      toast.success('Reclutador retirado correctamente', { duration: 3000 });

      await this.queryClient.invalidateQueries({
        queryKey: ['company-recruiters'],
      });
    },
  }));

  async dismiss() {
    await this.dismissRecruiterMutation.mutateAsync();
    this.visible.set(false);
  }

  closeModal() {
    this.visible.set(false);
  }
}
