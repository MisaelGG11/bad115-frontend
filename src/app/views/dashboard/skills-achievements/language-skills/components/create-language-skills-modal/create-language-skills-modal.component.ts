import { Component, inject, Input, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomInputComponent } from '../../../../../../components/inputs/custom-input/custom-input.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import {
  injectMutation,
  injectQueryClient,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { CandidateService } from '../../../../../../services/candidate.service';
import { CreateLanguageSkillDto } from '../../../../../../services/interfaces/candidate.dto';
import { toast } from 'ngx-sonner';
import { StyleClassModule } from 'primeng/styleclass';
import { SelectComponent } from '../../../../../../components/inputs/select/select.component';
import { LanguageSkillType } from '../../../../../../interfaces/candidate.interface';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-create-language-skills-modal',
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
  templateUrl: './create-language-skills-modal.component.html',
  styles: ``,
})
export class CreateLanguageSkillModalComponent {
  private candidateService = inject(CandidateService);
  private person = JSON.parse(localStorage.getItem('person') ?? '');
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  form: FormGroup;
  LanguageSkillsTypesOptions: Array<{ label: string; value: string | { name: string } }> = [];

  languageSkillOptions: Array<{ label: string; value: string }> = [
    { label: 'Escucha', value: 'Escucha' },
    { label: 'Lectura', value: 'Lectura' },
    { label: 'Escritura', value: 'Escritura' },
    { label: 'Conversación', value: 'Conversación' },
  ];

  languageLevelOptions: Array<{ label: string; value: string }> = [
    { label: 'A1', value: 'A1' }, { label: 'A2', value: 'A2' },
    { label: 'B1', value: 'B1' }, { label: 'B2', value: 'B2' },
    { label: 'C1', value: 'C1' }, { label: 'C2', value: 'C2' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      languageId: ['', [Validators.required]],
      skill: ['', [Validators.required]],
      level: ['', [Validators.required]],
    });
  }

  LanguageSkillsTypesRequest = injectQuery(() => ({
    queryKey: ['languageSkillType'],
    queryFn: async () => {
      const data = await this.candidateService.getLanguage();
      this.addLanguageSkillsTypesOptions(data);
      return data;
    },
  }));

  addLanguageSkillsTypesOptions(types: LanguageSkillType[]) {
    this.LanguageSkillsTypesOptions = types.map((type) => ({
      label: type.language,
      value: type.id,
    }));
  }

  createLanguageSkillMutation = injectMutation(() => ({
    mutationFn: async (input: CreateLanguageSkillDto) =>
      await this.candidateService.createLanguageSkill(this.person.candidateId, input),
    onSuccess: async () => {
      toast.success('Habilidad Lingüística creada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['languageSkills'] });
      this.form.reset();
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    await this.createLanguageSkillMutation.mutateAsync(this.form.value);
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }

  ngOnInit(): void {
    this.LanguageSkillsTypesRequest.refetch();
  }
}
