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
import { UpdateLaborExperienceDto } from '../../../../../services/interfaces/candidate.dto';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarComponent } from '../../../../../components/inputs/calendar/calendar.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputErrorsComponent } from '../../../../../components/inputs/input-errors/input-errors.component';
import { toast } from 'ngx-sonner';
import { TextareaComponent } from '../../../../../components/inputs/textarea/textarea.component';

@Component({
  selector: 'edit-labor-experience-modal',
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
    TextareaComponent,
  ],
  templateUrl: './edit-labor-experience-modal.component.html',
  styles: [],
})
export class EditLaborExperienceModalComponent implements OnChanges {
  private candidateService = inject(CandidateService);
  private person = getPersonLocalStorage();
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() laborExperienceId = '';
  form: FormGroup;
  today = new Date();
  checked = signal(false);

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required]],
        organizationName: ['', [Validators.required]],
        initDate: [new Date(), [Validators.required]],
        finishDate: [new Date()],
        functionPerformed: ['', [Validators.required]],
        currentJob: [false],
        organizationContactEmail: ['', [Validators.email]],
        organizationContactPhone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      },
      {
        validators: validateInitAndFinishDate,
      },
    );
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['laborExperienceId'] && !changes['laborExperienceId'].isFirstChange()) {
      const { data } = await this.laborExperienceRequest.refetch();

      this.form.patchValue({
        ...data,
        initDate: data?.initDate ? new Date(data.initDate) : new Date(),
        finishDate: data?.finishDate ? new Date(data.finishDate) : null,
        organizationContactEmail: data?.organizationContact.email,
        organizationContactPhone: data?.organizationContact.phone,
      });

      this.checked.set(data?.currentJob ?? false);
    }
  }

  laborExperienceRequest = injectQuery(() => ({
    queryKey: [
      'laborExperience',
      { candidateId: this.person.candidateId, laborExperienceId: this.laborExperienceId },
    ],
    queryFn: async () =>
      await this.candidateService.getLaborExperience(
        this.person.candidateId,
        this.laborExperienceId,
      ),
    enabled: !!this.laborExperienceId,
  }));

  editLaborExperience = injectMutation(() => ({
    mutationFn: (updateLaborExperienceDto: UpdateLaborExperienceDto) =>
      this.candidateService.updateLaborExperience(
        this.person.candidateId,
        this.laborExperienceId,
        updateLaborExperienceDto,
      ),
    onSuccess: async () => {
      toast.success('Experiencia laboral editada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['laborExperience'] });
    },
  }));

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

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const { currentJob } = this.form.value;

    await this.editLaborExperience.mutateAsync({
      ...this.form.value,
      currentJob: currentJob[0] === 'true',
      finishDate: currentJob[0] === 'true' ? null : this.form.value.finishDate,
      organizationContact: {
        phone: this.form.value.organizationContactPhone,
        email: this.form.value.organizationContactEmail,
      },
    });

    this.visible.set(false);
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }
}
