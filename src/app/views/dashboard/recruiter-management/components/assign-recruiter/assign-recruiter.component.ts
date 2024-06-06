import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { toast } from 'ngx-sonner';
import { CompanyService } from '../../../../../services/company.service';
import { getCompanyLocalStorage } from '../../../../../utils/local-storage.utils';

@Component({
  selector: 'app-assign-recruiter',
  standalone: true,
  imports: [ButtonModule, CustomInputComponent, DialogModule, ReactiveFormsModule],
  templateUrl: './assign-recruiter.component.html',
  styles: ``,
})
export class AssignRecruiterComponent {
  private companyService = inject(CompanyService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  company = getCompanyLocalStorage();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  assignRecruiterMutation = injectMutation(() => ({
    mutationFn: async (email: string) =>
      this.companyService.assignRecruiter(this.company.id, email),
    onSuccess: async () => {
      toast.success('Reclutador asigando correctamente', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: ['company-recruiters'],
      });
      this.form.reset();
    },
  }));

  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    await this.assignRecruiterMutation.mutateAsync(this.form.value.email);
    this.visible.set(false);
  }
}
