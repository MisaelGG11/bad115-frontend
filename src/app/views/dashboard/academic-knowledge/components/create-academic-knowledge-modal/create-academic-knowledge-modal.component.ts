import { Component, inject, Input, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { NgClass, NgIf } from '@angular/common';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { CandidateService } from '../../../../../services/candidate.service';
import { CreateAcademicKnowledgeDto } from '../../../../../services/interfaces/candidate.dto';
import { createAcademicKnowledgeSchema } from './create-academic-knowledge.schema';
import { validateInitAndFinishDate } from '../../../../../validators/init-and-finish-date.validators';
import { InputErrorsComponent } from '../../../../../components/inputs/input-errors/input-errors.component';
import { toast } from 'ngx-sonner';
import { StyleClassModule } from 'primeng/styleclass';
import { CalendarComponent } from '../../../../../components/inputs/calendar/calendar.component';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-create-academic-knowledge-modal',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    CalendarModule,
    CustomInputComponent,
    CheckboxModule,
    InputTextareaModule,
    NgClass,
    NgIf,
    InputErrorsComponent,
    StyleClassModule,
    CalendarComponent,
    DropdownModule,
  ],
  templateUrl: './create-academic-knowledge-modal.component.html',
  styles: [],
})
export class CreateAcademicKnowledgeModalComponent {
  private candidateService = inject(CandidateService);
  private person = JSON.parse(localStorage.getItem('person') ?? '{}');
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  form: FormGroup;
  checked = signal(false);
  today = new Date();
  typeOptions: Array<{ label: string; value: string }> = [];

  constructor(private fb: FormBuilder) {
    this.typeOptions = [
      { label: 'Titulo', value: 'Titulo' },
      { label: 'Diploma', value: 'Diploma' },
      { label: 'Cursos', value: 'Cursos' },
    ];

    this.form = this.fb.group(
      {
        name: ['', [Validators.required]],
        type: ['', [Validators.required]],
        initDate: [null, [Validators.required]],
        finishDate: [null, [Validators.required]],
        organizationName: ['', [Validators.required]],
      },
      {
        validators: [validateInitAndFinishDate],
      }
    );

    this.form.valueChanges.subscribe((values) => {
      const errors = createAcademicKnowledgeSchema.validate(values, { abortEarly: false });
      if (errors.error) {
        console.log(errors.error.details);
      }
    });
  }

  createAcademicKnowledgeMutation = injectMutation(() => ({
    mutationFn: async (input: CreateAcademicKnowledgeDto) =>
      await this.candidateService.createAcademicKnowledgeDto(this.person.candidateId, input),
    onSuccess: async () => {
      toast.success('Conocimiento Académico Creado', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['academicKnowledge'] });
      this.form.reset();
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    await this.createAcademicKnowledgeMutation.mutateAsync(this.form.value);
  }
  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }
}
