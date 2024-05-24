import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
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
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { CandidateService } from '../../../../../../services/candidate.service';
import { UpdateCertificationDto } from '../../../../../../services/interfaces/candidate.dto';
import { validateInitAndFinishDate } from '../../../../../../validators/init-and-finish-date.validators';
import { InputErrorsComponent } from '../../../../../../components/inputs/input-errors/input-errors.component';
import { toast } from 'ngx-sonner';
import { StyleClassModule } from 'primeng/styleclass';
import { CalendarComponent } from '../../../../../../components/inputs/calendar/calendar.component';

@Component({
  selector: 'app-edit-certification-modal',
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
  templateUrl: './edit-certification-modal.component.html',
  styles: ``,
})
export class EditCertificationModalComponent {
  private candidateService = inject(CandidateService);
  private person = JSON.parse(localStorage.getItem('person') ?? '');
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() certificationId = '';
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

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['certificationId'] && !changes['certificationId'].isFirstChange()) {
      const { data } = await this.certificationRequest.refetch();
      console.log(data);
      this.form.patchValue({
        ...data,
        initDate: data?.initDate ? new Date(data.initDate) : null,
        finishDate: data?.finishDate ? new Date(data.finishDate) : null,
      });
      console.log(this.form.value);
    }
  }

  certificationRequest = injectQuery(() => ({
    queryKey: [
      'certifications',
      {
        candidateId: this.person.candidateId,
        certificationId: this.certificationId,
      },
    ],
    queryFn: async () =>
      await this.candidateService.getCertification(this.person.candidateId, this.certificationId),
    enabled: !!this.certificationId,
  }));

  editCertificationMutation = injectMutation(() => ({
    mutationFn: async (updateCertificationDto: UpdateCertificationDto) =>
      await this.candidateService.updateCertification(
        this.person.candidateId,
        this.certificationId,
        updateCertificationDto,
      ),
    onSuccess: async () => {
      toast.success('Certificación actualizada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['certifications'] });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    await this.editCertificationMutation.mutateAsync(this.form.value);
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }
}
