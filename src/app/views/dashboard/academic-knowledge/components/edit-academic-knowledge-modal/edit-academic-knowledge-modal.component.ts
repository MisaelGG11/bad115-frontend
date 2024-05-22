import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CandidateService } from '../../../../../services/candidate.service';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { getPersonLocalStorage } from '../../../../../utils/person-local-storage.utils';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { validateInitAndFinishDate } from '../../../../../validators/init-and-finish-date.validators';
import { UpdateAcademicKnowledgeDto } from '../../../../../services/interfaces/candidate.dto';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarComponent } from '../../../../../components/inputs/calendar/calendar.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputErrorsComponent } from '../../../../../components/inputs/input-errors/input-errors.component';
import { toast } from 'ngx-sonner';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-edit-academic-knowledge-modal',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    CustomInputComponent,
    CheckboxModule,
    CalendarComponent,
    InputTextareaModule,
    NgClass,
    ButtonModule,
    InputErrorsComponent,
    DropdownModule,
  ],
  templateUrl: './edit-academic-knowledge-modal.component.html',
  styles: [],
})
export class EditAcademicKnowledgeModalComponent implements OnChanges {
  private candidateService = inject(CandidateService);
  private person = getPersonLocalStorage();
  private queryClient = injectQueryClient();

  @Input() visible = signal(false);
  @Input() academicKnowledgeId = '';

  form: FormGroup;
  today = new Date();
  checked = signal(false);
  typeOptions: Array<{ label: string; value: string }> = [
    { label: 'Titulo', value: 'Titulo' },
    { label: 'Diploma', value: 'Diploma' },
    { label: 'Cursos', value: 'Cursos' },
  ];

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required]],
        type: ['', [Validators.required]],
        organizationName: ['', [Validators.required]],
        initDate: [new Date(), [Validators.required]],
        finishDate: [new Date(), [Validators.required]],
      },
      {
        validators: validateInitAndFinishDate,
      },
    );
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['academicKnowledgeId'] && !changes['academicKnowledgeId'].isFirstChange()) {
      const { data } = await this.academicKnowledgeRequest.refetch();

      this.form.patchValue({
        ...data,
        initDate: data?.initDate ? new Date(data.initDate) : new Date(),
        finishDate: data?.finishDate ? new Date(data.finishDate) : null,
      });
    }
  }

  academicKnowledgeRequest = injectQuery(() => ({
    queryKey: [
      'academicKnowledge',
      { candidateId: this.person.candidateId, academicKnowledgeId: this.academicKnowledgeId },
    ],
    queryFn: async () =>
      await this.candidateService.getAcademicKnowledge(
        this.person.candidateId,
        this.academicKnowledgeId,
      ),
    enabled: !!this.academicKnowledgeId,
  }));

  editAcademicKnowledge = injectMutation(() => ({
    mutationFn: (updateAcademicKnowledge: UpdateAcademicKnowledgeDto) =>
      this.candidateService.updateAcademicKnowledgeDto(
        this.person.candidateId,
        this.academicKnowledgeId,
        updateAcademicKnowledge,
      ),
    onSuccess: async () => {
      toast.success('Conocimiento Académico editado', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['academicKnowledge'] });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    await this.editAcademicKnowledge.mutateAsync(this.form.value);
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }
}
