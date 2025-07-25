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
import { CreateLaborExperienceDto } from '../../../../../services/interfaces/candidate.dto';
import { validateInitAndFinishDate } from '../../../../../validators/init-and-finish-date.validators';
import { InputErrorsComponent } from '../../../../../components/inputs/input-errors/input-errors.component';
import { toast } from 'ngx-sonner';
import { StyleClassModule } from 'primeng/styleclass';
import { CalendarComponent } from '../../../../../components/inputs/calendar/calendar.component';
import { TextareaComponent } from '../../../../../components/inputs/textarea/textarea.component';
import { CustomInputMaskComponent } from '../../../../../components/inputs/custom-input-mask/custom-input-mask.component';

@Component({
  selector: 'create-labor-experience-modal',
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
    TextareaComponent,
    CustomInputMaskComponent,
  ],
  templateUrl: './create-labor-experience-modal.component.html',
  styles: [],
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
        name: ['', [Validators.required]],
        organizationName: ['', [Validators.required]],
        initDate: [null, [Validators.required]],
        finishDate: [null],
        functionPerformed: ['', [Validators.required]],
        currentJob: [false],
        organizationContactEmail: ['', [Validators.email]],
        organizationContactPhone: ['', [Validators.required]],
      },
      {
        validators: [validateInitAndFinishDate],
      },
    );
  }

  createLaborExperienceMutation = injectMutation(() => ({
    mutationFn: async (input: CreateLaborExperienceDto) =>
      await this.candidateService.createLaborExperience(this.person.candidateId, input),
    onSuccess: async () => {
      toast.success('Experiencia laboral creada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['laborExperience'] });
      this.form.reset();
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const { currentJob } = this.form.value;

    const currentJobValidation = currentJob?.length > 0 && currentJob[0] === 'true';

    await this.createLaborExperienceMutation.mutateAsync({
      ...this.form.value,
      currentJob: currentJobValidation,
      finishDate: currentJobValidation ? null : this.form.value.finishDate,
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
