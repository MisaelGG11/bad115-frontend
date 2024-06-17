import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { SelectComponent } from '../../../../../components/inputs/select/select.component';
import { Company } from '../../../../../interfaces/company.interface';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { JobService } from '../../../../../services/job.service';
import { getPersonLocalStorage } from '../../../../../utils/local-storage.utils';
import {
  contractOptionsJobPosition,
  experienceOptionsJobPosition,
  modalityOptionsJobPosition,
  workDayOptionsJobPosition,
} from '../../../../../utils/job-position.utils';
import { CalendarComponent } from '../../../../../components/inputs/calendar/calendar.component';
import { addDays } from 'date-fns';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-edit-job-position',
  standalone: true,
  imports: [
    DialogModule,
    CustomInputComponent,
    FormsModule,
    ReactiveFormsModule,
    SelectComponent,
    CalendarComponent,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './edit-job-position.component.html',
  styles: ``,
})
export class EditJobPositionComponent implements OnChanges {
  private jobService = inject(JobService);
  @Input() visible = signal(false);
  @Input() jobPositionId = '';
  queryClient = injectQueryClient();
  person = getPersonLocalStorage();
  form: FormGroup;
  companiesOptions: Array<{ label: string; value: string }> = [];
  today = new Date();
  tomorrow = addDays(new Date(), 1);

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      salaryRange: ['', Validators.required],
      modality: ['', Validators.required],
      contractType: ['', Validators.required],
      experiencesLevel: ['', Validators.required],
      workday: ['', Validators.required],
      description: ['', Validators.required],
      closeTime: ['', Validators.required],
      companyId: ['', Validators.required],
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.jobPositionRequest.refetch();
  }

  jobPositionRequest = injectQuery(() => ({
    queryKey: ['job-position', this.jobPositionId],
    queryFn: async () => {
      const response = await this.jobService.getJobPosition(this.jobPositionId);

      this.form.patchValue({
        name: response.name,
        salaryRange: response.salaryRange,
        modality: response.modality,
        contractType: response.contractType,
        experiencesLevel: response.experiencesLevel,
        workday: response.workday,
        description: response.description,
        closeTime: new Date(response.closeTime),
        companyId: response.company.id,
      });

      return response;
    },
  }));

  companiesRequest = injectQuery(() => ({
    queryKey: ['recruiter-companies'],
    queryFn: async () => {
      const { data } = await this.jobService.getRecruiterCompanies(this.person.recruiterId);
      this.addCompanies(data);
      return data;
    },
  }));

  addCompanies(companies: Company[]) {
    this.companiesOptions = companies.map((company) => ({
      label: company.name,
      value: company.id,
    }));
  }

  editJobPositionMutation = injectMutation(() => ({
    mutationFn: async () =>
      await this.jobService.updateJobPosition(this.jobPositionId, this.form.value),
    onSuccess: async () => {
      await Promise.all([
        this.queryClient.invalidateQueries({ queryKey: ['job-positions-candidates'] }),
        this.queryClient.invalidateQueries({ queryKey: ['job-position'] }),
      ]);
      this.visible.set(false);
    },
  }));

  protected readonly workDayOptions = workDayOptionsJobPosition;
  protected readonly modalityOptions = modalityOptionsJobPosition;
  protected readonly experienceOptions = experienceOptionsJobPosition;
  protected readonly contractOptions = contractOptionsJobPosition;

  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    await this.editJobPositionMutation.mutateAsync(this.form.value);
  }
}
