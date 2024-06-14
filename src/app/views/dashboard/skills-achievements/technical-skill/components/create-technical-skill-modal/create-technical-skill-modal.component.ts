import { Component, inject, Input, signal, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from '../../../../../../components/inputs/custom-input/custom-input.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import {
  injectMutation,
  injectQueryClient,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { CandidateService } from '../../../../../../services/candidate.service';
import { TechnicalSkillService } from '../../../../../../services/technical-skill.service';
import { CreateTechnicalSkillDto } from '../../../../../../services/interfaces/candidate.dto';
import { toast } from 'ngx-sonner';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { SelectComponent } from '../../../../../../components/inputs/select/select.component';
import {
  TechnicalCategoryTypes,
  TechnicalType,
} from '../../../../../../interfaces/candidate.interface';

@Component({
  selector: 'app-create-technical-skill-modal',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    CustomInputComponent,
    InputTextareaModule,
    CommonModule,
    StyleClassModule,
    SelectComponent,
    ButtonModule,
  ],
  templateUrl: './create-technical-skill-modal.component.html',
  styles: ``,
})
export class CreateTechnicalSkillModalComponent implements OnInit {
  private candidateService = inject(CandidateService);
  private person = JSON.parse(localStorage.getItem('person') ?? '{}');
  private queryClient = injectQueryClient();
  private technicalSkillService = inject(TechnicalSkillService);

  @Input() visible = signal(false);
  form: FormGroup;
  technicalSkillsCategoryOptions: Array<{ label: string; value: string }> = [];
  technicalSkillsTypesOptions: Array<{ label: string; value: string }> = [];
  categoryId: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      technicalSkillCategoryId: [null, [Validators.required]],
      technicalSkillTypeId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.technicalSkillsCategoryRequest.refetch();
    this.form.get('technicalSkillCategoryId')?.valueChanges.subscribe((categoryId) => {
      this.categoryId = categoryId;
      this.technicalSkillsTypesRequest.refetch();
    });
  }

  technicalSkillsCategoryRequest = injectQuery(() => ({
    queryKey: ['technicalCategoryTypes'],
    queryFn: async () => {
      const data = await this.candidateService.getTechnicalCategoryTypes();
      this.addTechnicalCategoryTypesOptions(data);
      return data;
    },
  }));

  addTechnicalCategoryTypesOptions(types: TechnicalCategoryTypes[]) {
    this.technicalSkillsCategoryOptions = types.map((type) => ({
      label: type.name,
      value: type.id,
    }));
  }

  technicalSkillsTypesRequest = injectQuery(() => ({
    queryKey: ['TechnicalType', this.categoryId],
    queryFn: async () => {
      if (!this.categoryId) {
        return [];
      }
      try {
        const data = await this.technicalSkillService.findManyByCategoryId(this.categoryId);
        this.addTechnicalSkillTypesOptions(data?.technicalSkill ?? []);

        return data;
      } catch (error) {
        console.error('Error fetching technical skills:', error);
        return [];
      }
    },
  }));
  addTechnicalSkillTypesOptions(types: TechnicalType[]) {
    this.technicalSkillsTypesOptions = types.map((type) => ({
      label: type.name,
      value: type.id,
    }));
  }

  createTechnicalSkillMutation = injectMutation(() => ({
    mutationFn: async (input: CreateTechnicalSkillDto) => {
      const respose = await this.candidateService.createTechnicalSkill(
        this.person.candidateId,
        input.technicalSkillTypeId,
        input.technicalSkill,
      );
      if (respose.status === 200 || respose.status === 201) {
        return respose.data;
      } else {
        throw new Error();
      }
    },
    onSuccess: async () => {
      toast.success('Habilidad Técnica creada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['technicalSkills'] });
      this.form.reset();
    },
  }));

  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    await this.createTechnicalSkillMutation.mutateAsync({
      technicalSkill: this.form.value.technicalSkillTypeId,
      technicalSkillTypeId: this.form.value.technicalSkillCategoryId,
    });
  }
}
