import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CustomInputComponent } from '../../../../../../components/inputs/custom-input/custom-input.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import {
  injectMutation,
  injectQueryClient,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { CandidateService } from '../../../../../../services/candidate.service';
import { UpdateTechnicalSkillsDto } from '../../../../../../services/interfaces/candidate.dto';
import { toast } from 'ngx-sonner';
import { StyleClassModule } from 'primeng/styleclass';
import { SelectComponent } from '../../../../../../components/inputs/select/select.component';
import { TechnicalSkillType } from '../../../../../../interfaces/candidate.interface';
@Component({
  selector: 'app-edit-technical-skill-modal',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    CalendarModule,
    CustomInputComponent,
    InputTextareaModule,
    CommonModule,
    StyleClassModule,
    SelectComponent,
  ],
  templateUrl: './edit-technical-skill-modal.component.html',
  styles: ``
})

export class EditTechnicalSkillModalComponent {
  private candidateService = inject(CandidateService);
  private person = JSON.parse(localStorage.getItem('person') ?? '');
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() technicalSkillId = '';
  form: FormGroup;
  selectedType = signal('');
  technicalSkillsTypesOptions: Array<{ label: string; value: string | { name: string } }> = [];
  today = new Date();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      technicalSkillTypeId: ['', [Validators.required]],
      finishDate: [null, [Validators.required]],
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['technicalSkillId'] && !changes['technicalSkillId'].isFirstChange()) {
      await this.technicalSkillsTypesRequest.refetch();
    }
  }

  technicalSkillsTypesRequest = injectQuery(() => ({
    queryKey: ['technicalSkillType'],
    queryFn: async () => {
      const data = await this.candidateService.getTechnicalSkillTypes();
      this.addTechnicalSkillsTypesOptions(data);
      return data;
    },
  }));

  addTechnicalSkillsTypesOptions(types: TechnicalSkillType[]) {
    this.technicalSkillsTypesOptions = types.map((type) => ({
      label: type.name,
      value: type.id,
    }));
  }

  technicalSkillRequest = injectQuery(() => ({
    queryKey: [
      'technicalSkills',
      {
        candidateId: this.person.candidateId,
        technicalSkillId: this.technicalSkillId,
      },
    ],
    queryFn: async () =>
      await this.candidateService.getTechnicalSkill(this.person.candidateId, this.technicalSkillId),
    enabled: !!this.technicalSkillId,
  }));

  editTechnicalSkillMutation = injectMutation(() => ({
    mutationFn: async (updateTechnicalSkillDto: UpdateTechnicalSkillsDto) =>
      await this.candidateService.updateTechnicalSkills(
        this.person.candidateId,
        this.technicalSkillId,
        updateTechnicalSkillDto,
      ),
    onSuccess: async () => {
      toast.success('Habilidad Técnica actualizada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['technicalSkills'] });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    await this.editTechnicalSkillMutation.mutateAsync(this.form.value);
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }
}


