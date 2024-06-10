import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { TechnicalSkillService } from '../../../../../../../services/technical-skill.service';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TechnicalSkill } from '../../../../../../../interfaces/technical-skill.interface';
import { CustomInputComponent } from '../../../../../../../components/inputs/custom-input/custom-input.component';
import { SelectComponent } from '../../../../../../../components/inputs/select/select.component';
import { toast } from 'ngx-sonner';
import { ButtonModule } from 'primeng/button';

interface UpdateTechnicalSkill {
  technicalSkillsId: string;
  name: string;
  categoryId: string;
}

@Component({
  selector: 'app-edit-technical-skill',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, CustomInputComponent, SelectComponent, ButtonModule],
  templateUrl: './edit-technical-skill.component.html',
})
export class EditTechnicalSkillComponent implements OnChanges {
  private technicalSkillService = inject(TechnicalSkillService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() readOnly = signal(false);
  @Input() technicalSkill!: TechnicalSkill;
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

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['technicalSkill'] && !changes['technicalSkill'].isFirstChange()) {
      this.form.patchValue({
        name: this.technicalSkill.name,
        categoryId: this.technicalSkill.categoryTechnicalSkillId,
      });
      await this.catalogTechnicalSkill.refetch();
      await this.technicalSkillRequest.refetch();
    }
  }

  technicalSkillRequest = injectQuery(() => ({
    queryKey: ['technicalSkills', 'notPaginated'],
    queryFn: async () => {
      const response = await this.technicalSkillService.findOneTechnicalSkill(
        this.technicalSkill.id,
      );
      this.form.patchValue({
        name: response.name,
        categoryId: response.categoryTechnicalSkillId,
      });
      return response;
    },
    enabled: !!this.technicalSkill.id,
  }));

  editTechnicalSkillMutation = injectMutation(() => ({
    mutationFn: async ({ technicalSkillsId, name, categoryId }: UpdateTechnicalSkill) =>
      await this.technicalSkillService.updateTechnicalSkill(technicalSkillsId, name, categoryId),
    onSuccess: async () => {
      toast.success('Habilidad técnica actualizada', { duration: 3000 });
      await Promise.all([
        this.queryClient.invalidateQueries({
          queryKey: ['technicalSkills'],
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

    await this.editTechnicalSkillMutation.mutateAsync({
      technicalSkillsId: this.technicalSkill.id,
      name: this.form.value.name,
      categoryId: this.form.value.categoryId,
    });
    this.visible.set(false);
  }
}
