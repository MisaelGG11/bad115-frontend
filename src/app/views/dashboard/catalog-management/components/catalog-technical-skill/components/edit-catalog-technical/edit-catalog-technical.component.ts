import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogTechnicalSkill } from '../../../../../../../interfaces/technical-skill.interface';
import { TechnicalSkillService } from '../../../../../../../services/technical-skill.service';
import { toast } from 'ngx-sonner';
import { DialogModule } from 'primeng/dialog';
import { CustomInputComponent } from '../../../../../../../components/inputs/custom-input/custom-input.component';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-edit-catalog-technical',
  standalone: true,
  imports: [
    DialogModule,
    CustomInputComponent,
    ReactiveFormsModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './edit-catalog-technical.component.html',
})
export class EditCatalogTechnicalComponent implements OnChanges {
  private technicalSkillService = inject(TechnicalSkillService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() readOnly = signal(false);
  @Input() catalogTechnicalSkill!: CatalogTechnicalSkill;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
  }

  catalogTechnicalSkillsRequest = injectQuery(() => ({
    queryKey: [
      'catalogTechnicalSkills',
      { catalogTechnicalSkillId: this.catalogTechnicalSkill.id },
    ],
    queryFn: async () => {
      const response = await this.technicalSkillService.findOneCatalog(
        this.catalogTechnicalSkill.id,
      );
      this.form.patchValue({
        name: response.name,
      });

      return response;
    },
    enabled: !!this.catalogTechnicalSkill.id,
  }));

  editCatalogTechnicalSkillMutation = injectMutation(() => ({
    mutationFn: async (name: string) =>
      this.technicalSkillService.updateCatalog(this.catalogTechnicalSkill.id, name),
    onSuccess: async () => {
      toast.success('Catalogo actualizado', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: ['catalogTechnicalSkills'],
      });
    },
  }));

  async submit() {
    this.form.markAsTouched();

    if (this.form.invalid) {
      return;
    }

    await this.editCatalogTechnicalSkillMutation.mutateAsync(this.form.value.name);

    this.visible.set(false);
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['catalogTechnicalSkill'] && !changes['catalogTechnicalSkill'].isFirstChange()) {
      this.form.patchValue({
        name: this.catalogTechnicalSkill.name,
      });
      await this.catalogTechnicalSkillsRequest.refetch();
    }
  }
}
