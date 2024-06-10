import { Component, inject, Input, signal } from '@angular/core';
import { TechnicalSkillService } from '../../../../../../../services/technical-skill.service';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toast } from 'ngx-sonner';
import { ButtonModule } from 'primeng/button';
import { CustomInputComponent } from '../../../../../../../components/inputs/custom-input/custom-input.component';
import { DialogModule } from 'primeng/dialog';
import { SelectComponent } from '../../../../../../../components/inputs/select/select.component';

@Component({
  selector: 'app-create-technical-skill',
  standalone: true,
  imports: [
    ButtonModule,
    CustomInputComponent,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './create-technical-skill.component.html',
})
export class CreateTechnicalSkillComponent {
  private technicalSkillService = inject(TechnicalSkillService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  form: FormGroup;
  catalogs: { label: string; value: string }[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
    });
  }

  catalogTechnicalSkill = injectQuery(() => ({
    queryKey: ['catalogTechnicalSkills', 'notPaginated'],
    queryFn: async () => {
      const response = await this.technicalSkillService.findCatalog();

      this.catalogs = response.map((catalog) => ({
        label: catalog.name,
        value: catalog.id,
      }));

      return response;
    },
  }));

  createTechnicalSkillMutation = injectMutation(() => ({
    mutationFn: async (createTechnicalSkill: { categoryId: string; name: string }) =>
      this.technicalSkillService.createTechnicalSkill(
        createTechnicalSkill.categoryId,
        createTechnicalSkill.name,
      ),
    onSuccess: async () => {
      toast.success('Habilidad técnica creada', { duration: 3000 });
      await Promise.all([
        this.queryClient.invalidateQueries({
          queryKey: ['technicalSkills', 'catalogTechnicalSkills'],
        }),
        this.queryClient.invalidateQueries({
          queryKey: ['catalogTechnicalSkills'],
        }),
      ]);
    },
  }));

  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    await this.createTechnicalSkillMutation.mutateAsync({
      categoryId: this.form.value.categoryId,
      name: this.form.value.name,
    });
    this.visible.set(false);
  }
}
