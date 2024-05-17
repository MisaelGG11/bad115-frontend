import { Component, inject, Input, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { NgClass, NgIf } from '@angular/common';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { CandidateService } from '../../../../../services/candidate.service';
import { CreateLaborExperience } from '../../../../../services/interfaces/candidate.interface';
import { createLaborExperienceSchema } from './create-labor-experience.schema';
import { createValidatorFromSchema } from '../../../../../utils/validator.utils';
import { InputErrorsComponent } from '../../../../../components/inputs/input-errors/input-errors.component';
import { toast } from 'ngx-sonner';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-create-labor-experience-modal',
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
  ],
  templateUrl: './create-labor-experience-modal.component.html',
  styles: `
    input.ng-dirty.ng-invalid {
      outline: red auto 1px;
    }

    .errorText {
      color: maroon;
      font-size: 0.75rem;
      margin-top: -0.5rem;
    }
  `,
})
export class CreateLaborExperienceModalComponent {
  private candidateService = inject(CandidateService);
  private person = JSON.parse(localStorage.getItem('person') ?? '');
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  form: FormGroup;
  checked = signal(false);
  today = new Date();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        name: [''],
        organizationName: [''],
        initDate: [new Date()],
        finishDate: [new Date()],
        functionPerformed: [''],
        currentJob: [false],
        organizationContactEmail: [''],
        organizationContactPhone: [''],
      },
      {
        validators: createValidatorFromSchema(createLaborExperienceSchema),
      },
    );
  }

  createLaborExperienceMutation = injectMutation(() => ({
    mutationFn: async (input: CreateLaborExperience) =>
      await this.candidateService.createLaborExperience(this.person.candidateId, input),
    onSuccess: async () => {
      toast.success('Experiencia laboral creada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['laborExperience'] });
      this.form.reset();
    },
  }));

  async submit() {
    if (this.form.invalid) {
      return;
    }

    const { currentJob } = this.form.value;

    await this.createLaborExperienceMutation.mutateAsync({
      ...this.form.value,
      currentJob: currentJob[0] === 'true',
      finishDate: currentJob[0] === 'true' ? null : this.form.value.finishDate,
      organizationContact: {
        phone: this.form.value.organizationContactPhone,
        email: this.form.value.organizationContactEmail,
      },
    });
  }

  onChangeCurrentJob(event: any) {
    const [value] = event.checked;

    if (value === 'true') {
      this.form.get('finishDate')?.disable();
      this.checked.set(true);
    } else {
      this.form.get('finishDate')?.enable();
      this.checked.set(false);
    }
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }
}
