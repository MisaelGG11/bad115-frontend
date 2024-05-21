import { Component, inject, Input, signal } from '@angular/core';
import { format } from 'date-fns';
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
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { CandidateService } from '../../../../../../services/candidate.service';
import { CreateCertificationDto } from '../../../../../../services/interfaces/candidate.dto';
import { validateInitAndFinishDate } from '../../../../../../validators/init-and-finish-date.validators';
import { InputErrorsComponent } from '../../../../../../components/inputs/input-errors/input-errors.component';
import { toast } from 'ngx-sonner';
import { StyleClassModule } from 'primeng/styleclass';
import { CalendarComponent } from '../../../../../../components/inputs/calendar/calendar.component';

@Component({
  selector: 'app-create-certification-modal',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    CalendarModule,
    CustomInputComponent,
    CheckboxModule,
    InputTextareaModule,
    CommonModule,
    InputErrorsComponent,
    StyleClassModule,
    CalendarComponent,
    CalendarComponent,
  ],
  templateUrl: './create-certification-modal.component.html',
  styles: ``,
})
export class CreateCertificationModalComponent {
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
        finishDate: [null, [Validators.required]],
        type: ['', [Validators.required]],
        code: ['', [Validators.required]],
      },
      {
        validators: [validateInitAndFinishDate],
      },
    );
  }

  createCertificationMutation = injectMutation(() => ({
    mutationFn: async (input: CreateCertificationDto) =>
      await this.candidateService.createCertification(this.person.candidateId, input),
    onSuccess: async () => {
      toast.success('Certificación creada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['certification'] });
      this.form.reset();
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    await this.createCertificationMutation.mutateAsync(this.form.value);
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }
}
