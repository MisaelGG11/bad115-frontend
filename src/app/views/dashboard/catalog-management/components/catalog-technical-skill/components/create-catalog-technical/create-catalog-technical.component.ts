import { Component, Input, inject, signal } from '@angular/core';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TechnicalSkillService } from '../../../../../../../services/technical-skill.service';
import { toast } from 'ngx-sonner';
import { ButtonModule } from 'primeng/button';
import { CustomInputComponent } from '../../../../../../../components/inputs/custom-input/custom-input.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-create-catalog-technical',
  standalone: true,
  imports: [ButtonModule, CustomInputComponent, DialogModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-catalog-technical.component.html',
})
export class CreateCatalogTechnicalComponent {
  private technicalSkillService = inject(TechnicalSkillService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
  }

  createCatalogTechnicalMutation = injectMutation(() => ({
    mutationFn: async (name: string) => this.technicalSkillService.createCatalog(name),
    onSuccess: async () => {
      toast.success('Catálogo creado', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: ['catalogTechnicalSkills'],
      });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    await this.createCatalogTechnicalMutation.mutateAsync(this.form.value.name);
    this.visible.set(false);
  }
}
