import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { CompanyService } from '../../../../../services/company.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { getCompanyLocalStorage } from '../../../../../utils/local-storage.utils';
import { Recruiter } from '../../../../../interfaces/person.interface';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recruiter-profile',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './recruiter-profile.component.html',
  styles: ``,
})
export class RecruiterProfileComponent {
  private companyService = inject(CompanyService);
  @Input() visible = signal(false);
  @Input() recruiterId = '';
  company = getCompanyLocalStorage();
  profile!: Recruiter;

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['recruiterId'] && !changes['recruiterId'].isFirstChange()) {
      await this.recruiterRequest.refetch();
    }
  }

  recruiterRequest = injectQuery(() => ({
    queryKey: [
      'company-recruiters',
      {
        companyId: this.company.id,
        recruiterId: this.recruiterId,
      },
    ],
    queryFn: async () =>
      (this.profile = await this.companyService.getCompanyRecruiter(
        this.company.id,
        this.recruiterId,
      )),
    enabled: !!this.recruiterId,
  }));
}
