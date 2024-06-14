import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
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
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import {
  injectMutation,
  injectQueryClient,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { CandidateService } from '../../../../../../services/candidate.service';
import { UpdateLanguageSkillDto } from '../../../../../../services/interfaces/candidate.dto';
import { toast } from 'ngx-sonner';
import { StyleClassModule } from 'primeng/styleclass';
import { SelectComponent } from '../../../../../../components/inputs/select/select.component';
import { LanguageSkillType } from '../../../../../../interfaces/candidate.interface';

@Component({
  selector: 'app-edit-language-skills-modal',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    CustomInputComponent,
    InputTextareaModule,
    CommonModule,
    StyleClassModule,
    ButtonModule,
    SelectComponent,
  ],
  templateUrl: './edit-language-skills-modal.component.html',
  styles: ``,
})
export class EditLanguageSkillModalComponent {
  private candidateService = inject(CandidateService);
  private person = JSON.parse(localStorage.getItem('person') ?? '');
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() LanguageSkillId = '';
  form: FormGroup;
  selectedType = signal('');
  LanguageSkillsTypesOptions: Array<{ label: string; value: string }> = [];

  languageSkillOptions: Array<{ label: string; value: string }> = [
    { label: 'Escucha', value: 'Escucha' },
    { label: 'Lectura', value: 'Lectura' },
    { label: 'Escritura', value: 'Escritura' },
    { label: 'Conversación', value: 'Conversación' },
  ];

  languageLevelOptions: Array<{ label: string; value: string }> = [
    { label: 'A1', value: 'A1' },
    { label: 'A2', value: 'A2' },
    { label: 'B1', value: 'B1' },
    { label: 'B2', value: 'B2' },
    { label: 'C1', value: 'C1' },
    { label: 'C2', value: 'C2' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      languageId: ['', [Validators.required]],
      skill: ['', [Validators.required]],
      level: ['', [Validators.required]],
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['LanguageSkillId'] && !changes['LanguageSkillId'].isFirstChange()) {
      await this.languageSkillsTypesRequest.refetch();
      const { data } = await this.languageSkillsRequest.refetch();
      this.form.patchValue({
        ...data,
        languageId: data?.language.id,
      });
    }
  }

  languageSkillsTypesRequest = injectQuery(() => ({
    queryKey: ['LanguageSkillsType'],
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

  languageSkillsRequest = injectQuery(() => ({
    queryKey: [
      'LanguageSkills',
      {
        candidateId: this.person.candidateId,
        languageSkillsId: this.LanguageSkillId,
      },
    ],
    queryFn: async () =>
      await this.candidateService.getLanguageSkill(this.person.candidateId, this.LanguageSkillId),
    enabled: !!this.LanguageSkillId,
  }));

  editLanguageSkillMutation = injectMutation(() => ({
    mutationFn: async (updateLanguageSkillsDto: UpdateLanguageSkillDto) =>
      await this.candidateService.updateLanguageSkill(
        this.person.candidateId,
        this.LanguageSkillId,
        updateLanguageSkillsDto,
      ),
    onSuccess: async () => {
      toast.success('Habilidad Lingüística actualizada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['LanguageSkills'] });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    await this.editLanguageSkillMutation.mutateAsync(this.form.value);
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }

  ngOnInit(): void {
    if (this.visible()) {
      this.languageSkillsTypesRequest.refetch();
    }
  }
}
