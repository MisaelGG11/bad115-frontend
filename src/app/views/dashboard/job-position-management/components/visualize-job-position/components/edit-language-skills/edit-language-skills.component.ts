import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { LanguageSkillDto } from '../../../../../../../services/interfaces/job.dto';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { toast } from 'ngx-sonner';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageSkill } from '../../../../../../../interfaces/job.interface';
import { JobService } from '../../../../../../../services/job.service';
import { CustomInputComponent } from '../../../../../../../components/inputs/custom-input/custom-input.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectComponent } from '../../../../../../../components/inputs/select/select.component';

@Component({
  selector: 'app-edit-language-skills',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    SelectComponent,
    CustomInputComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-language-skills.component.html',
  styles: ``,
})
export class EditLanguageSkillsComponent {
  private jobService = inject(JobService);
  @Input() visible = signal(false);
  @Input() jobPositionId: string = '';
  @Input() jobPositionLanguageSkills: any = [];
  languageLevelOptions: Array<{ label: string; value: string | { name: string } }> = [
    { label: 'A1', value: 'A1' },
    { label: 'A2', value: 'A2' },
    { label: 'B1', value: 'B1' },
    { label: 'B2', value: 'B2' },
    { label: 'C1', value: 'C1' },
    { label: 'C2', value: 'C2' },
  ];
  skillsOptions: Array<{ label: string; value: string | { name: string } }> = [
    { label: 'Escucha', value: 'Escucha' },
    { label: 'Lectura', value: 'Lectura' },
    { label: 'Escritura', value: 'Escritura' },
    { label: 'Conversación', value: 'Conversación' },
  ];
  languageOptions: Array<{ label: string; value: string }> = [];
  form: FormGroup;
  queryClient = injectQueryClient();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      languageSkills: this.fb.array([]),
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['jobPositionLanguageSkills']) {
      console.log(this.jobPositionLanguageSkills);
      this.form.setControl('languageSkills', this.fb.array([]));
      this.jobPositionLanguageSkills.forEach((languageSkill: LanguageSkill) => {
        const languageSkillFormGroup = this.fb.group({
          languageId: [languageSkill.language.id, Validators.required],
          level: [languageSkill.level, Validators.required],
          skill: [languageSkill.skill, Validators.required],
        });
        this.languageSkills.push(languageSkillFormGroup);
      });
    }
  }

  languageRequest = injectQuery(() => ({
    queryKey: ['languages'],
    queryFn: async () => {
      const { data } = await this.jobService.getLanguages();
      this.languageOptions = data.map((language: any) => ({
        label: language.language,
        value: language.id,
      }));
      return data;
    },
  }));

  get languageSkills(): FormArray {
    return this.form.get('languageSkills') as FormArray;
  }

  addlanguageSkill(event: Event) {
    const languageSkillFormGroup = this.fb.group({
      languageId: ['', Validators.required],
      level: ['', Validators.required],
      skill: ['', Validators.required],
    });
    this.languageSkills.push(languageSkillFormGroup);
    event.preventDefault();
  }

  removelanguageSkill(event: Event, index: number) {
    this.languageSkills.removeAt(index);
    event.preventDefault();
  }

  editJobPositionLanguageSkillsMutation = injectMutation(() => ({
    mutationFn: async (input: LanguageSkillDto) =>
      await this.jobService.updateLanguageSkills(this.jobPositionId, input),
    onSuccess: async () => {
      toast.success('Habilidades de lenguaje actualizadas', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['job-positions'] });
      this.form.reset();
    },
  }));

  submit() {
    this.form.markAllAsTouched();

    console.log(this.form.value);
    if (this.form.invalid) {
      return;
    }
    this.editJobPositionLanguageSkillsMutation.mutateAsync(this.form.value);
  }
}
